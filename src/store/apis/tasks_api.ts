import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { getFormDigestValue } from "../../utils/db";
// Remove: import * as moment from "moment";
import dayjs from 'dayjs';

const commonSelectParams = [
    "*",
    "Employee/Id", "Employee/Title",
    "Department/Id", "Department/Title",
    "JobProfile/Id,JobProfile/Title",
    "TaskType/Id,TaskType/Title",
].join(",");

const commonExpandParams = [
    "Employee",
    "Department",
    "AttachmentFiles",
    "JobProfile",
    "TaskType",
].join(",");

const tasksApi = createApi({
    reducerPath: "tasks",
    baseQuery: async (args, api, extraOptions) => {
        const state = api.getState() as RootState;
        const rootUrl = state.config.rootUrl;
        const token = state.config.token;
        const rawBaseQuery = fetchBaseQuery({
            baseUrl: rootUrl,
            prepareHeaders: async (headers) => {
                headers.set("Accept", "application/json; odata=verbose");
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
                if (args.method && args.method.toLowerCase() != "get") {
                    const RequestDigest = await getFormDigestValue(rootUrl, token);
                    headers.set("X-RequestDigest", RequestDigest);
                }
                return headers;
            },
        });

        return rawBaseQuery(args, api, extraOptions);
    },
    tagTypes: ["Tasks", "Attachment"],
    endpoints: (builder) => ({
        fetchTasksRequests: builder.query<any, number>({
            providesTags: ["Tasks"],
            query: (employee_id) => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('Tasks')/items",
                params: {
                    $select: commonSelectParams,
                    $expand: commonExpandParams,
                    $orderBy: "Created desc",
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results
        }),
        fetchTasksRequestsByEmployeeId: builder.query<any, number>({
            providesTags: ["Tasks"],
            query: (employee_id) => ({
                // const status = encodeURIComponent('جاري التنفيذ');
                method: "GET",
                url: "/_api/web/lists/getbytitle('Tasks')/items",
                params: {
                    // $filter: `Employee/Id eq ${employee_id} and Status eq '${status}'`,
                    // $filter: `EmployeeId eq ${employee_id}`,
                    $filter: `EmployeeId eq ${employee_id} and substringof('جاري التنفيذ', Status)`,
                    $select: commonSelectParams,
                    $expand: commonExpandParams,
                    $orderBy: "Created desc",
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results
        }),
        fetchTasksTodayRequestsByManagerId: builder.query<any[], {
            managerId: number;
            dateToday: string;
        }>({
            query: ({ managerId, dateToday }) => {
                // Format the date properly for SharePoint datetime filter using dayjs
                const formattedDate = dayjs(dateToday).format('YYYY-MM-DD');

                return {
                    method: "GET",
                    url: "/_api/web/lists/getbytitle('Tasks')/items",
                    params: {
                        $filter: `ManagerIDId eq ${managerId} and Date eq '${formattedDate}'`,
                        $select: commonSelectParams,
                        $expand: commonExpandParams,
                        $top: 10000,
                    },
                };
            },
            transformResponse: (response: any) => response.d.results,
        }),

        createTask: builder.mutation<any, {
            Title: string;
            Description?: string;
            StartDate?: string;
            DueDate?: string;
            Status: string;
            Priority: string;
            TaskTypeId?: number | null;
            DepartmentId?: number | null;
            ConcernedEntity?: string;
            EmployeeId?: number;
            ManagerIDId?: number;
        }>({
            invalidatesTags: ["Tasks"],
            query: (data) => {
                return {
                    url: "/_api/web/lists/getbytitle('Tasks')/items",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; odata=verbose",
                        "Accept": "application/json; odata=verbose",
                    },
                    body: {
                        __metadata: { type: 'SP.Data.TasksListItem' },
                        ...data
                    }
                };
            },
        }),

        updateTask: builder.mutation<any, {
            id: number;
            data: {
                Title?: string;
                Description?: string;
                StartDate?: string;
                DueDate?: string;
                Status?: string;
                Priority?: string;
                TaskTypeId?: number | null;
                DepartmentId?: number | null;
                ConcernedEntity?: string;
                EmployeeId?: number;
                ManagerIDId?: number;
            }
        }>({
            invalidatesTags: ["Tasks"],
            query: ({ id, data }) => {
                return {
                    url: `/_api/web/lists/getbytitle('Tasks')/items(${id})`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; odata=verbose",
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "MERGE"
                    },
                    body: {
                        __metadata: { type: "SP.Data.TasksListItem" },
                        ...data
                    },
                };
            },
        }),

        deleteTask: builder.mutation<any, number>({
            invalidatesTags: ["Tasks"],
            query: (id) => ({
                url: `/_api/web/lists/getbytitle('Tasks')/items(${id})`,
                method: "POST",
                headers: {
                    "IF-MATCH": "*",
                    "X-HTTP-Method": "DELETE"
                },
            }),
        }),

        uploadTaskAttachment: builder.mutation<void, { taskId: number; file: File }>({
            query: ({ taskId, file }) => {
                return {
                    url: `/_api/web/lists/getbytitle('Tasks')/items(${taskId})/AttachmentFiles/add(FileName='${encodeURIComponent(file.name)}')`,
                    method: "POST",
                    headers: {
                        "Accept": "application/json; odata=verbose",
                    },
                    body: file,
                };
            },
        }),
        fetchTaskAttachments: builder.query<any[], number>({
            providesTags: (result, error, taskId) => [
                { type: 'Attachment' as const, id: taskId },
                ...(result ? result.map(({ FileName }: any) => ({
                    type: 'Attachment' as const,
                    id: `${taskId}-${FileName}`
                })) : [])
            ],
            query: (taskId) => ({
                url: `/_api/web/lists/getbytitle('Tasks')/items(${taskId})/AttachmentFiles`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.d?.results || [],
        }),

        deleteAttachment: builder.mutation<void, { taskId: number; fileName: string }>({
            invalidatesTags: (result, error, { taskId, fileName }) => [
                { type: 'Tasks' as const, id: taskId },
                { type: 'Attachment' as const, id: taskId },
                { type: 'Attachment' as const, id: `${taskId}-${fileName}` }
            ],
            query: ({ taskId, fileName }) => ({
                url: `/_api/web/lists/getbytitle('Tasks')/items(${taskId})/AttachmentFiles('${encodeURIComponent(fileName)}')`,
                method: 'DELETE',
            }),
        }),
    }),
});

export { tasksApi };
export const {
    useFetchTasksRequestsQuery,
    useFetchTasksRequestsByEmployeeIdQuery,
    useFetchTasksTodayRequestsByManagerIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useUploadTaskAttachmentMutation,
    useFetchTaskAttachmentsQuery,
    useDeleteAttachmentMutation,
} = tasksApi;