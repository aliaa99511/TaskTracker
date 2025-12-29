import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { getFormDigestValue } from "../../utils/db";

const userApi = createApi({
    reducerPath: "user",
    tagTypes: ["Users"],
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
        fetchUsers: builder.query<any[], string>({
            providesTags: ["Users"],
            query: (key) => ({
                method: "GET",
                url: "/_api/web/siteusers",
                params: {
                    $filter: key ? `substringof('${key}', Email) or substringof('${key}', Title)` : '',
                    $top: 5000,
                },
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        fetchCurrentUser: builder.query<any, void>({
            query: () => ({
                url: "/_api/web/currentuser",
                method: "GET",
            }),
            transformResponse: (response: any) => response.d,
        }),
        fetchEmployeeProfile: builder.query<any, number>({
            query: (employeeId) => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('Employees')/items",
                params: {
                    $filter: `Id eq ${employeeId}`,
                    $select: "Id,Title,Manager/Id,Manager/Title",
                    $expand: "Manager",
                },
            }),
            transformResponse: (response: any) => response.d.results[0],
        }),
        fetchEmployeeId: builder.query<number | null, void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {

                const currentUserRes: any = await fetchWithBQ({
                    method: "GET",
                    url: "/_api/web/currentuser",
                });

                if (currentUserRes.error) return { error: currentUserRes.error };
                const currentUserId = currentUserRes.data?.d?.Id;
                if (!currentUserId) return { data: null };

                const employeeRes: any = await fetchWithBQ({
                    method: "GET",
                    url: "/_api/web/lists/getbytitle('Employee')/items",
                    params: {
                        $filter: `Employee/Id eq '${currentUserId}'`,
                        $select: "ID",
                    },
                });

                if (employeeRes.error) return { error: employeeRes.error };
                const employeeId = employeeRes.data?.d?.results?.[0]?.ID ?? null;
                return { data: employeeId };
            },
        }),

        fetchEmployeeByUserId: builder.query<any, number>({
            query: (userId) => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('Employee')/items",
                params: {
                    $filter: `Employee/Id eq ${userId}`,
                    $select: "ID,Title,Manager/Id,Manager/Title,Employee/Id,Employee/Title",
                    $expand: "Manager,Employee",
                },
            }),
            transformResponse: (response: any) => response.d.results[0] || null,
        }),

        fetchUserGroups: builder.query<any[], void>({
            query: () => ({
                method: "GET",
                url: "/_api/web/currentuser/groups",
            }),
            transformResponse: (response: any) => response.d.results,
        }),

    }),
});

export { userApi };

export const {
    useFetchUsersQuery,
    useFetchCurrentUserQuery,
    useFetchEmployeeProfileQuery,
    useFetchEmployeeIdQuery,
    useFetchEmployeeByUserIdQuery,
    useFetchUserGroupsQuery,
} = userApi;
