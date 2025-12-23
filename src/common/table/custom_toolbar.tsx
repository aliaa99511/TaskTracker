import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { GridToolbarQuickFilter } from '@mui/x-data-grid';

export interface CustomToolbarProps {
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
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                p: 1,
            }}
        >
            {!hideQuickFilter && (
                <GridToolbarQuickFilter
                    variant="outlined"
                    size="small"
                    placeholder="بحث"
                    sx={{
                        width: 260,
                        '& .MuiInputBase-root': { borderRadius: 8 },
                        '& .MuiInputBase-input': { px: 1.5 },
                    }}
                />
            )}

            <Stack direction="row" spacing={0.5}>
                {extraActions}
            </Stack>
        </Box>
    );
};

export default CustomToolbar;
