import * as React from 'react';
import { Box, Pagination, PaginationItem, PaginationRenderItemParams } from "@mui/material";
import {
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";

export function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Box display="flex" justifyContent="center" m={2} width={"100%"}>
            <Pagination
                color="primary"
                variant="outlined"
                shape="rounded"
                page={page + 1}
                count={pageCount}
                renderItem={(props: PaginationRenderItemParams) => <PaginationItem {...props} />}
                onChange={(event, value) => apiRef.current.setPage(value - 1)}
            />
        </Box>
    );
}
