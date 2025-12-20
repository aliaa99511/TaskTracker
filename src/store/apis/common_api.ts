import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { getFormDigestValue } from "../../utils/db";
// import { sp } from "@pnp/sp";

const commonApi = createApi({
    reducerPath: "common",
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
        fetchListChoiceFields: builder.query<any[], string>({
            query: (list_name) => ({
                method: "GET",
                url: `/_api/web/lists/getbytitle('${list_name}')/fields?`,
                params: {
                    $filter: "CanBeDeleted eq true and TypeAsString eq 'Choice'"
                }
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        fetchListData: builder.query<any[], string>({
            query: (list_name) => ({
                method: "GET",
                url: `/_api/web/lists/getbytitle('${list_name}')/items?`,
                params: {
                    $filter: "Active eq 1"
                }
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        fetchListDataByFilter: builder.query<any[], { list_name: string; filter: string }>({
            query: ({ list_name, filter }) => ({
                method: "GET",
                url: `/_api/web/lists/getbytitle('${list_name}')/items?`,
                params: {
                    $filter: filter
                }
            }),
            transformResponse: (response: any) => response.d.results,
        }),
        updateDocumentProps: builder.mutation<any, { libraryName: string, itemId: number, NewData: object }>({
            query: ({ libraryName, itemId, NewData }) => ({
                url: `/_api/web/lists/getbytitle('${libraryName}')/items(${itemId})`,
                method: "POST",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "IF-MATCH": "*",
                    "X-HTTP-Method": "MERGE"
                },
                body: {
                    __metadata: { type: `SP.Data.${libraryName}Item` },
                    ...NewData
                }
            }),
        }),
        deleteDocumentLibraryFile: builder.mutation<any, string>({
            query: (fileURL) => ({
                url: `/_api/web/getfilebyserverrelativeurl('${fileURL}')`,
                method: "DELETE",
                headers: {
                    "X-HTTP-Method": "DELETE",
                    "IF-MATCH": "*",
                    "Accept": "application/json;odata=verbose"
                },
            }),
        }),
        uploadListAttachment: builder.mutation<any, { listName: string; itemId: number; file: File }>({
            query: ({ listName, itemId, file }) => ({
                url: `/_api/web/lists/getbytitle('${listName}')/items(${itemId})/AttachmentFiles/add(FileName='${file.name}')`,
                method: "POST",
                headers: {
                    Accept: "application/json;odata=verbose",
                },
                body: file,
            }),
        }),
        deleteListAttachment: builder.mutation<any, { listName: string; itemId: number; fileName: string }>({
            query: ({ listName, itemId, fileName }) => ({
                method: "POST",
                url: `/_api/web/lists/getbytitle('${listName}')/items(${itemId})/AttachmentFiles('${fileName}')`,
                headers: {
                    "X-HTTP-Method": "DELETE",
                    "IF-MATCH": "*",
                    "Accept": "application/json;odata=verbose"
                },
            }),

        }),

    }),
})


export { commonApi };
export const {
    useFetchListChoiceFieldsQuery,
    useFetchListDataQuery,
    useFetchListDataByFilterQuery,
    useUpdateDocumentPropsMutation,
    useUploadListAttachmentMutation,
    useDeleteListAttachmentMutation,
    useDeleteDocumentLibraryFileMutation
} = commonApi;