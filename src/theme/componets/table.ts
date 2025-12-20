import { Theme } from "@mui/material";

const MuiTable = {
    styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
            return {
                '& .MuiTableCell-root': {
                    textAlign: theme.direction == "rtl" ? "right" : "left",
                    padding: "12px"
                },
                '& .MuiTableCell-root.center': {
                    textAlign: "center"
                },
                '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                    border: "none"
                }
            }
        },
    }
};
export default MuiTable;