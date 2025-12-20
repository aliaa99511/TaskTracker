import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { Stack } from '@mui/material';
// import { Stack } from '@mui/material';
import {
    // GridToolbarColumnsButton,
    // GridToolbarFilterButton,
    // GridToolbarExport,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';


export function CustomToolbar({ extraActions, isFiltered, hideQuickFilter = false }: { extraActions: any, isFiltered: any, hideQuickFilter?: boolean }) {
    return (
        <Grid container columnSpacing={10} mt={1} mb={1}>

            {!hideQuickFilter && (
                <Grid size={{ md: 5 }}>
                    <GridToolbarQuickFilter
                        variant="outlined"
                        size="small"
                        placeholder={"بحث"}
                        sx={{ width: "100%", "& .MuiInputBase-root": { borderRadius: 8 }, "& .MuiInputBase-input": { margin: "0 10px" } }}
                    />
                </Grid>
            )}

            <Grid size={{ md: 7 }}>

                <Stack height={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"flex-end"} gap={.5}>
                    {/* <GridToolbarFilterButton
                        slotProps={{
                            tooltip: { title: strings.FiltersButtonLable },
                            button: {
                                className: isFiltered ? "hasFilter" : "",
                                startIcon: null,
                                variant: 'contained',
                                color: "primary",
                                sx: { padding: '3px 1rem', minWidth: "auto", borderRadius: "50px" },
                            },
                        }}
                    />
                    <GridToolbarColumnsButton
                        slotProps={{
                            tooltip: { title: strings.ColumnsButtonLable },
                            button: {
                                startIcon: null,
                                variant: 'contained',
                                color: "primary",
                                sx: { padding: '3px 1rem', minWidth: "auto", borderRadius: "50px" },
                            },
                        }}
                    />
                    <GridToolbarExport
                        csvOptions={{
                            utf8WithBom: true,
                        }}
                        printOptions={{
                            hideFooter: true,
                            hideToolbar: true,
                            allColumns: true,
                            disableToolbarButton: true
                        }}
                        slotProps={{
                            tooltip: { title: strings.ExportButtonLable },
                            button: {
                                startIcon: null,
                                variant: 'contained',
                                color: "primary",
                                sx: { padding: '3px 1rem', minWidth: "auto", borderRadius: "50px" },
                            },
                        }}
                    /> */}
                    {extraActions}
                </Stack>

            </Grid>
        </Grid>
    );
}