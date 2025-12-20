import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { getFormDigestValue } from "../../utils/db";

const jobProfileApi = createApi({
    reducerPath: "jobProfile",
    tagTypes: ["JobProfile"],
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
        fetchJobProfile: builder.query<any[], void>({
            providesTags: ["JobProfile"],
            query: () => ({
                method: "GET",
                url: "/_api/web/lists/getbytitle('JobProfile')/items",
                params: {
                    $orderBy: "Title desc",
                    $top: 10000,
                },
            }),
            transformResponse: (response: any) => response.d.results,
        }),
    }),
});

export { jobProfileApi };
export const { useFetchJobProfileQuery } = jobProfileApi;