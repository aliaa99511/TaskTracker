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

const graphApi = createApi({
    reducerPath: "graph",
    tagTypes: ["GraphUser"],
    baseQuery: fetchBaseQuery({
        baseUrl: "https://graph.microsoft.com/v1.0",
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            const token = state.config.token;

            headers.set("Accept", "application/json");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        fetchCurrentUserGraph: builder.query<GraphUser, void>({
            query: () => "/me?$select=displayName,mail,jobTitle,department,id",
            transformResponse: (response: any) => response,
            providesTags: ["GraphUser"],
        }),

        fetchUserPhotoByEmail: builder.query<string | null, string>({
            queryFn: async (email, _api, _extraOptions, baseQuery) => {
                if (!email) {
                    return { data: null };
                }

                try {
                    // First, find the user by email
                    const searchResult = await baseQuery({
                        url: `/users?$filter=mail eq '${email}'&$select=id,mail`,
                    });

                    if (searchResult.error) {
                        return { error: searchResult.error };
                    }

                    const usersData = searchResult.data as GraphUsersResponse;

                    if (!usersData?.value?.length) {
                        return { data: null };
                    }

                    const user = usersData.value[0];

                    // Then fetch the photo using a separate fetch call
                    // since we need to handle blob response differently
                    const state = _api.getState() as RootState;
                    const token = state.config.token;

                    const photoResponse = await fetch(
                        `https://graph.microsoft.com/v1.0/users/${user.id}/photo/$value`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "image/jpeg",
                            },
                        }
                    );

                    if (!photoResponse.ok) {
                        // Return null if photo doesn't exist (404) or other error
                        return { data: null };
                    }

                    const blob = await photoResponse.blob();
                    const photoUrl = URL.createObjectURL(blob);

                    return { data: photoUrl };
                } catch (error: any) {
                    // Cast the error to FetchBaseQueryError
                    return {
                        error: {
                            status: 'CUSTOM_ERROR',
                            error: error?.message || 'Unknown error'
                        }
                    };
                }
            },
            providesTags: (_result, _error, email) => [{ type: "GraphUser", id: email }],
        }),
    }),
});

export { graphApi };
export const {
    useFetchCurrentUserGraphQuery,
    useFetchUserPhotoByEmailQuery
} = graphApi;