import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { getFormDigestValue } from "../../utils/db";

const taskTypeApi = createApi({
    reducerPath: "taskType",
    tagTypes: ["TaskType"],
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
                if (args.method.toLowerCase() != "get") {
                    const RequestDigest = await getFormDigestValue(rootUrl, token);
                    headers.set("X-RequestDigest", RequestDigest);
                }
                return headers;
            },
        });

        return rawBaseQuery(args, api, extraOptions);
    },
    endpoints: (builder) => ({
        fetchTaskTypeWithDepartment: builder.query<any[], number | null>({
            providesTags: ["TaskType"],
            query: (DepartmentId) => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('TaskType')/items",
                params: {
                    $filter: `DepartmentId eq ${DepartmentId ? DepartmentId : "null"}`,
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        fetchAllTaskType: builder.query<any[], void>({
            providesTags: ["TaskType"],
            query: () => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('TaskType')/items",
                params: {
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results,
        }),
    }),
});

export { taskTypeApi };
export const { useFetchTaskTypeWithDepartmentQuery, useFetchAllTaskTypeQuery } = taskTypeApi;