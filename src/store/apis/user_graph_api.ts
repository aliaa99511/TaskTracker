import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";

// Define types for Graph API responses
export interface GraphUser {
    id: string;
    displayName?: string;
    mail?: string;
    jobTitle?: string;
    department?: string;
}

interface GraphUsersResponse {
    value: GraphUser[];
}

// interface GraphPhotoResponse {
//     // Photo endpoint returns a blob URL string
// }

const graphApi = createApi({
    reducerPath: "graph",
    tagTypes: ["GraphUser"],
    baseQuery: async (args, api, extraOptions) => {
        const state = api.getState() as RootState;
        const token = state.config.token;

        const rawBaseQuery = fetchBaseQuery({
            baseUrl: "https://graph.microsoft.com/v1.0",
            prepareHeaders: async (headers) => {
                headers.set("Accept", "application/json");
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
                return headers;
            },
        });

        return rawBaseQuery(args, api, extraOptions);
    },
    endpoints: (builder) => ({
        fetchCurrentUserGraph: builder.query<GraphUser, void>({
            query: () => "/me?$select=displayName,mail,jobTitle,department,Id",
            transformResponse: (response: any) => response,
            providesTags: ["GraphUser"],
        }),

        fetchUserPhotoByEmail: builder.query<string | null, string>({
            async queryFn(email, _api, _extraOptions, baseQuery) {
                if (!email) return { data: null };

                try {
                    // First, find the user by email
                    const searchResult = await baseQuery({
                        url: `/users?$filter=mail eq '${email}'&$select=id,mail`,
                    });

                    if (searchResult.error) return { error: searchResult.error };

                    // Cast the response to the correct type
                    const usersData = searchResult.data as GraphUsersResponse;

                    if (!usersData?.value?.length) return { data: null };

                    const user = usersData.value[0];

                    // Then fetch the photo
                    const photoResult = await baseQuery({
                        url: `/users/${user.id}/photo/$value`,
                        responseHandler: async (response: any) => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch photo');
                            }
                            const blob = await response.blob();
                            return URL.createObjectURL(blob);
                        },
                        headers: {
                            Accept: "image/jpeg",
                        },
                    });

                    if (photoResult.error) {
                        return { error: photoResult.error };
                    }

                    return { data: photoResult.data as string };
                } catch (err) {
                    return { error: err };
                }
            },
            providesTags: (_result, _error, email) => [{ type: "GraphUser", email }],
        }),
    }),
});

export { graphApi };
export const {
    useFetchCurrentUserGraphQuery,
    useFetchUserPhotoByEmailQuery
} = graphApi;