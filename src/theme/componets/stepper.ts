import { alpha, Theme } from "@mui/material";

export const MuiStepper = {
    styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
            return {
                borderRadius: "5px",
                border: `1px solid ${alpha(theme.palette.text.primary, .15)}`
            }
        },
    },
};

export const MuiStep = {
    styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
            return {
                padding: 0,
                borderRight: `1px solid ${alpha(theme.palette.text.primary, .15)}`
            }
        },
    },
}

export const MuiStepLabel = {
    styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
            return {
                padding: "10px",
                '&:has(.Mui-active)': {
                    borderBottom: "2px solid",
                    borderColor: theme.palette.primary.main
                },
                '& .MuiStepLabel-iconContainer': {
                    padding: 0
                }
            }
        },
        label: ({ theme }: { theme: Theme }) => {
            return {
                color: alpha(theme.palette.text.primary, .6),
                '&.Mui-active': {
                    color: theme.palette.primary.main,
                },
                '&.Mui-completed': {
                    color: theme.palette.primary.main,
                },
            }
        },
    },
}