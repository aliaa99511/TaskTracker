import * as React from 'react';
import { Box } from '@mui/material';
import {
    DataGrid,
    DataGridProps,
    GridToolbarQuickFilter,
    GridFilterModel,
} from '@mui/x-data-grid';

import { CustomNoRowsOverlay } from './custom_noRows';
import { CustomNoResultsOverlay } from './custom_noResults';
import { CustomPagination } from './custom_pagination';
import { StyledDataGridWrapper } from './table_styles';

/* ================= Toolbar ================= */

interface CustomToolbarProps {
    extraActions?: React.ReactElement;
    isFiltered: boolean;
    hideQuickFilter?: boolean;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
    extraActions,
    hideQuickFilter = false,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
                p: .4,
            }}
        >
            {!hideQuickFilter && (
                <GridToolbarQuickFilter
                    variant="outlined"
                    size="small"
                    placeholder="بحث"
                    sx={{ width: 250 }}
                />
            )}

            <Box>{extraActions}</Box>
        </Box>
    );
};

/* ================= DataGrid ================= */

interface CustomDataGridProps extends DataGridProps {
    isLoading: boolean;
    extraActions?: React.ReactElement;
    hideQuickFilter?: boolean;
}

const PAGE_SIZE = 15;

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
    isLoading,
    columns,
    rows,
    extraActions,
    hideQuickFilter = false,
    ...rest
}) => {
    const [isFiltered, setIsFiltered] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(PAGE_SIZE);

    const handleFilterChange = (model: GridFilterModel) => {
        setIsFiltered(Boolean(model.items?.[0]?.value));
    };

    return (
        <Box sx={{ width: '100%', my: 1 }}>
            <StyledDataGridWrapper>
                <DataGrid
                    autoHeight
                    rows={rows}
                    columns={columns}
                    loading={isLoading}
                    getRowId={(row: any) => row.Id ?? row.ID ?? row.GUID}
                    disableSelectionOnClick
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[PAGE_SIZE]}
                    pagination
                    onFilterModelChange={handleFilterChange}
                    components={{
                        Toolbar: CustomToolbar,
                        Pagination: CustomPagination,
                        NoRowsOverlay: CustomNoRowsOverlay,
                        NoResultsOverlay: CustomNoResultsOverlay,
                    }}
                    componentsProps={{
                        toolbar: {
                            extraActions,
                            isFiltered,
                            hideQuickFilter,
                        } as CustomToolbarProps,
                    }}
                    {...rest}
                />
            </StyledDataGridWrapper>
        </Box>
    );
};

export default CustomDataGrid;
