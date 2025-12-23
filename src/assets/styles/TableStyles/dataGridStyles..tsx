import { alpha } from "@mui/material";

export const dataGridStyles = {
    /* cells */
    "& .MuiDataGrid-cell": {
        display: "flex",
        alignItems: "center",
        py: "12px",
    },

    "& .MuiDataGrid-cell .MuiTypography-root": {
        color: "text.primary",
    },

    /* header row */
    "& .MuiDataGrid-columnHeaders": {
        backgroundColor: (theme: any) =>
            alpha(theme.palette.primary.main, 0.01),
        borderBottom: "none",
    },

    /* each header cell */
    "& .MuiDataGrid-columnHeader": {
        backgroundColor: (theme: any) =>
            alpha(theme.palette.primary.main, 0.1),
    },

    /* header text */
    "& .MuiDataGrid-columnHeaderTitle": {
        color: "primary.main",
        fontWeight: 600,
    },
};
