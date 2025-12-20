import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { getFormDigestValue } from "../../utils/db";
import { getSelectQuery } from "../../utils/helpers";

const employee_lookups = {
    Department: ["Id", "Title"],
    JobProfile: ["Id", "Title"],
    AttachmentFiles: []
};

const employeeApi = createApi({
    reducerPath: "employee",
    tagTypes: ["Employees", "Employee"],
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
        // Fetch Functions
        fetchEmployees: builder.query<any[], void>({
            providesTags: ["Employees"],
            query: () => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('Employee')/items",
                params: {
                    $filter: `EmployeeId ne null`,
                    $select: getSelectQuery(employee_lookups),
                    $expand: Object.keys(employee_lookups).join(","),
                    $orderBy: "Created desc",
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        fetchEmployeesWithoutAccount: builder.query<any[], void>({
            providesTags: ["Employees"],
            query: () => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('Employee')/items",
                params: {
                    $filter: `EmployeeId eq null`,
                    $select: getSelectQuery(employee_lookups),
                    $expand: Object.keys(employee_lookups).join(","),
                    $orderBy: "Created desc",
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        fetchEmployeeById: builder.query<any, number>({
            providesTags: ["Employee"],
            query: (employeeId) => ({
                method: "GET",
                url: `/_api/web/lists/getbytitle('Employee')/items(${employeeId})`,
                params: {
                    $select: getSelectQuery(employee_lookups),
                    $expand: Object.keys(employee_lookups).join(","),
                },
            }),
            transformResponse: (response: any) => response.d,
        }),
        fetchEmployeeByManagerId: builder.query<any, number>({
            providesTags: ["Employee"],
            query: (manager_id) => ({
                method: "GET",
                url: `/_api/web/lists/getbytitle('Employee')/items`,
                params: {
                    $filter: `DirectManagerId eq '${manager_id}'`,
                    $select: getSelectQuery(employee_lookups),
                    $expand: Object.keys(employee_lookups).join(","),
                },
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        checkEmployeeId: builder.query<boolean, string>({
            query: (employee_id) => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('Employee')/items",
                params: {
                    $filter: `EmployeeID eq '${employee_id}'`,
                    $top: 1,
                },
            }),
            transformResponse: (response: any) => response.d.results.length > 0,
        }),
        // Mutation Functions
        addEmployee: builder.mutation<any, {}>({
            invalidatesTags: ["Employees"],
            query: (NewDate) => ({
                method: "POST",
                url: "/_api/web/lists/getbytitle('Employee')/items",
                body: NewDate
            }),
        }),
        updateEmployee: builder.mutation<any, { EmployeeId: number, NewData: object }>({
            invalidatesTags: ["Employees", "Employee"],
            query: ({ EmployeeId, NewData }) => ({
                method: "POST",
                url: `/_api/web/lists/getbytitle('Employee')/items(${EmployeeId})`,
                headers: {
                    "content-Type": "application/json;odata=verbose",
                    "IF-MATCH": "*",
                    "X-HTTP-Method": "MERGE"
                },
                body: {
                    __metadata: {
                        type: "SP.Data.EmployeeListItem"
                    },
                    ...NewData
                },
            }),
        }),

    }),
});

export { employeeApi };
export const {
    useFetchEmployeesQuery,
    useFetchEmployeesWithoutAccountQuery,
    useFetchEmployeeByIdQuery,
    useFetchEmployeeByManagerIdQuery,
    useLazyCheckEmployeeIdQuery,
    useAddEmployeeMutation,
    useUpdateEmployeeMutation
} = employeeApi;