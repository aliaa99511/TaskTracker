// import "./styles.css";
import * as React from 'react';
import { Box } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

import { CustomToolbar } from "./custom_toolbar";
import { CustomNoRowsOverlay } from "./custom_noRows";
import { CustomNoResultsOverlay } from "./custom_noResults";
import { CustomPagination } from "./custom_pagination";
import { StyledDataGridWrapper } from './table_styles';

interface CustomDataGridProps extends DataGridProps {
    isLoading: boolean;
    extraActions?: React.ReactElement;
    hideQuickFilter?: boolean;
}

const CustomDataGrid: React.FC<CustomDataGridProps> = ({ isLoading, columns, rows, extraActions, hideQuickFilter = false, slots, ...rest }) => {
    const PageSize = 15;

    const [isFiltered, setIsFiltered] = React.useState(false);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: PageSize,
        page: 0,
    });

    return (
        <Box sx={{ width: '100%', margin: "10px 0" }}>
            <StyledDataGridWrapper>
                <DataGrid
                    // autoHeight
                    rows={rows}
                    columns={columns}
                    loading={isLoading}
                    getRowId={(row) => row.Id ?? row.ID ?? row.GUID}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    pageSizeOptions={[PageSize]}
                    onFilterModelChange={(newFilterModel) => setIsFiltered(newFilterModel.items?.[0]?.value ? true : false)}
                    onPaginationModelChange={setPaginationModel}
                    paginationModel={paginationModel}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: PageSize,
                            },
                        },
                    }}
                    slots={{
                        pagination: CustomPagination,
                        toolbar: CustomToolbar,
                        noRowsOverlay: CustomNoRowsOverlay,
                        noResultsOverlay: CustomNoResultsOverlay,
                    }}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'skeleton',
                            noRowsVariant: 'skeleton',
                        },
                        toolbar: {
                            extraActions,
                            isFiltered,
                            hideQuickFilter: hideQuickFilter,
                        } as any,
                    }}

                    {...rest}
                />
            </StyledDataGridWrapper>
        </Box>
    );
};

export default CustomDataGrid;
