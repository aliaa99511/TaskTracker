import { alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledDataGridWrapper = styled('div')(({ theme }) => ({
    '--DataGrid-overlayHeight': '200px',

    '& *': {
        outline: 'none !important',
    },

    '& .MuiDataGrid-root': {
        border: 'none !important',
    },

    '& .MuiDataGrid-main': {
        border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
        borderBottom: 'none',
    },

    '& .MuiDataGrid-columnHeader': {
        backgroundColor: alpha(theme.palette.text.primary, 0.05),
        color: theme.palette.text.primary,
    },

    '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: theme.direction === 'rtl' ? 630 : 450,
    },

    '& .MuiDataGrid-row:hover': {
        backgroundColor: 'inherit',
    },

    '& .MuiDataGrid-cell': {
        color: theme.palette.text.primary,
        textAlign: theme.direction === 'rtl' ? 'right' : 'left',
    },
}));
