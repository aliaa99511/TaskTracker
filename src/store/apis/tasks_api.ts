import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { getFormDigestValue } from "../../utils/db";

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
        fetchTasksRequests: builder.query<any[], void>({
            providesTags: ["Tasks"],
            query: () => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('Tasks')/items",
                params: {
                    $select: commonSelectParams,
                    $expand: commonExpandParams,
                    $orderby: "Created desc",
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        fetchTasksRequestsByEmployeeId: builder.query<any, number>({
            providesTags: ["Tasks"],
            query: (employee_id) => {
                return {
                    method: "GET",
                    url: "/_api/web/lists/getbytitle('Tasks')/items",
                    params: {
                        $filter: `EmployeeId eq ${employee_id}`,
                        $select: commonSelectParams,
                        $expand: commonExpandParams,
                        $orderby: "Created desc",
                        $top: 10000,
                    },
                };
            },
            transformResponse: (response: any) => response.d.results
        }),
        fetchTasksRequestsByEmployeeIdWithCurrentMonth: builder.query<any, number>({
            providesTags: ["Tasks"],
            query: (employee_id) => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                const firstDayStr = firstDay.toISOString();
                const lastDayStr = lastDay.toISOString();

                return {
                    method: "GET",
                    url: "/_api/web/lists/getbytitle('Tasks')/items",
                    params: {
                        $filter: `EmployeeId eq ${employee_id} and Created ge datetime'${firstDayStr}' and Created le datetime'${lastDayStr}'`,
                        $select: commonSelectParams,
                        $expand: commonExpandParams,
                        $orderby: "Created desc",
                        $top: 10000,
                    },
                };
            },
            transformResponse: (response: any) => response.d.results
        }),
        fetchPendingTasksRequestsByEmployeeId: builder.query<any, number>({
            providesTags: ["Tasks"],
            query: (employee_id) => ({
                // const status = encodeURIComponent('جاري التنفيذ');
                method: "GET",
                url: "/_api/web/lists/getbytitle('Tasks')/items",
                params: {
                    // $filter: `Employee/Id eq ${employee_id} and Status eq '${status}'`,
                    // $filter: `EmployeeId eq ${employee_id}`,
                    $filter: `EmployeeId eq ${employee_id} and Status ne 'تم الانتهاء' and Status ne 'لم يتم الحل'`,
                    // $filter: `EmployeeId eq ${employee_id} and substringof('جاري التنفيذ', Status)`,
                    $select: commonSelectParams,
                    $expand: commonExpandParams,
                    $orderBy: "Created desc",
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results
        }),
        fetchRecentTasksRequests: builder.query<any[], void>({
            providesTags: ["Tasks"],
            query: () => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('Tasks')/items",
                params: {
                    $select: commonSelectParams,
                    $expand: commonExpandParams,
                    $orderby: "Created desc",
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => {
                const results = response.d.results;

                // Group tasks by employee and get the most recent task for each employee
                const employeeTasksMap = new Map<number, any>();

                results.forEach((task: any) => {
                    if (task.EmployeeId) {
                        const existingTask = employeeTasksMap.get(task.EmployeeId);

                        // If no task exists for this employee yet, or if current task is newer
                        if (!existingTask || new Date(task.Created) > new Date(existingTask.Created)) {
                            employeeTasksMap.set(task.EmployeeId, task);
                        }
                    }
                });

                // Return array of most recent tasks, one per employee
                return Array.from(employeeTasksMap.values())
                    .sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
            },
        }),

        fetchCurrentMonthTasksRequests: builder.query<any[], void>({
            providesTags: ["Tasks"],
            query: () => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                const firstDayStr = firstDay.toISOString();
                const lastDayStr = lastDay.toISOString();

                return {
                    method: "GET",
                    url: "/_api/web/lists/getbytitle('Tasks')/items",
                    params: {
                        $filter: `Created ge datetime'${firstDayStr}' and Created le datetime'${lastDayStr}'`,
                        $select: commonSelectParams,
                        $expand: commonExpandParams,
                        $orderby: "Created desc",
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

        fetchTaskNotes: builder.query({
            query: (id) => ({
                method: "GET",
                url: `/_api/web/lists/getbytitle('Tasks')/items(${id})/versions`,
                params: {
                    $select: "Notes,Created,Editor/Title,Editor/EMail",
                    $expand: "Editor"
                },
            }),
            transformResponse: (response: any) => response.d?.results || [],
            providesTags: (result, error, id) => [
                { type: 'Tasks' as const, id },
                { type: 'Tasks' as const, id: `${id}-notes` }
            ]
        }),

        addTaskComment: builder.mutation<any, { id: number; comment: string }>({
            invalidatesTags: (result, error, { id }) => [
                { type: 'Tasks' as const, id },
                { type: 'Tasks' as const, id: `${id}-notes` }
            ],
            query: ({ id, comment }) => {
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
                        Notes: comment
                    },
                };
            },
        }),

        updateTaskComment: builder.mutation<any, {
            taskId: number;
            versionId: number;
            comment: string;
        }>({
            invalidatesTags: (result, error, { taskId }) => [
                { type: 'Tasks' as const, id: taskId },
                { type: 'Tasks' as const, id: `${taskId}-notes` }
            ],
            query: ({ taskId, versionId, comment }) => {
                return {
                    url: `/_api/web/lists/getbytitle('Tasks')/items(${taskId})/versions(${versionId})`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; odata=verbose",
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "MERGE"
                    },
                    body: {
                        __metadata: { type: "SP.Data.TasksListItem" },
                        Notes: comment
                    },
                };
            },
        }),

        deleteTaskComment: builder.mutation<any, {
            taskId: number;
            versionId: number;
        }>({
            invalidatesTags: (result, error, { taskId }) => [
                { type: 'Tasks' as const, id: taskId },
                { type: 'Tasks' as const, id: `${taskId}-notes` }
            ],
            query: ({ taskId, versionId }) => ({
                url: `/_api/web/lists/getbytitle('Tasks')/items(${taskId})/versions(${versionId})`,
                method: "POST",
                headers: {
                    "IF-MATCH": "*",
                    "X-HTTP-Method": "DELETE"
                },
            }),
        }),
        // updateTaskComment: builder.mutation<any, {
        //     taskId: number;
        //     versionId: number;
        //     comment: string
        // }>({
        //     invalidatesTags: (result, error, { taskId }) => [
        //         { type: 'Tasks' as const, id: taskId },
        //         { type: 'Tasks' as const, id: `${taskId}-notes` }
        //     ],
        //     query: ({ taskId, versionId, comment }) => {
        //         return {
        //             url: `/_api/web/lists/getbytitle('Tasks')/items(${taskId})/versions(${versionId})`,
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json; odata=verbose",
        //                 "IF-MATCH": "*",
        //                 "X-HTTP-Method": "MERGE"
        //             },
        //             body: {
        //                 __metadata: { type: "SP.Data.TasksListItem" },
        //                 Notes: comment
        //             },
        //         };
        //     },
        // }),

        // deleteTaskComment: builder.mutation<any, {
        //     taskId: number;
        //     versionId: number
        // }>({
        //     invalidatesTags: (result, error, { taskId }) => [
        //         { type: 'Tasks' as const, id: taskId },
        //         { type: 'Tasks' as const, id: `${taskId}-notes` }
        //     ],
        //     query: ({ taskId, versionId }) => ({
        //         url: `/_api/web/lists/getbytitle('Tasks')/items(${taskId})/versions(${versionId})`,
        //         method: "POST",
        //         headers: {
        //             "IF-MATCH": "*",
        //             "X-HTTP-Method": "DELETE"
        //         },
        //     }),
        // }),

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
    useFetchTasksRequestsByEmployeeIdWithCurrentMonthQuery,
    useFetchPendingTasksRequestsByEmployeeIdQuery,
    useFetchRecentTasksRequestsQuery,
    useFetchCurrentMonthTasksRequestsQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useFetchTaskNotesQuery,
    useAddTaskCommentMutation,
    useUpdateTaskCommentMutation,
    useDeleteTaskCommentMutation,
    useUploadTaskAttachmentMutation,
    useFetchTaskAttachmentsQuery,
    useDeleteAttachmentMutation,
} = tasksApi;

