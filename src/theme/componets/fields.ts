import { Theme } from "@mui/material";

export const MuiFormControl = {
    styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
            return {
                "& .MuiInputBase-root, & .MuiPickersInputBase-root": {
                    borderRadius: 8,
                },
                "& .MuiPickersInputBase-root ": {
                    height: 50,
                    fontWeight: 400
                },
                "& .MuiInputBase-input": {
                    height: 18,
                    fontWeight: 400
                },
                "& .MuiFormHelperText-root": {
                    fontWeight: 400,
                    fontSize: ".82rem",
                    margin: "6px 0 0",
                    lineHeight: 1,
                },
                "& .Mui-disabled": {
                    opacity: .3,
                },
                ...(theme.direction === "rtl" && {
                    "& .MuiFormHelperText-root": {
                        textAlign: "right",
                        fontSize: ".75rem",
                        margin: "5px 0 0",
                        lineHeight: 1.5,
                        fontWeight: 350,
                    },
                    "& .MuiPickersSectionList-root": {
                        direction: "rtl",
                    },
                    "& .MuiButtonBase-root": {
                        padding: 5
                    },
                    "& .MuiAutocomplete-endAdornment, & .MuiInputAdornment-root": {
                        left: 8,
                        right: "unset !important",
                        margin: 0
                    },
                }),
            }
        },
    },
};

export const MuiAutocomplete = {
    styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
            return {
                ...(theme.direction === "rtl" && {
                    "& .MuiButtonBase-root": {
                        padding: 5,
                    },
                    "& .MuiInputBase-root": {
                        padding: "9px 9px 9px 39px !important"
                    },
                    "& .MuiAutocomplete-endAdornment, & .MuiInputAdornment-root": {
                        left: 8,
                        right: "unset !important",
                        margin: 0
                    },
                }),
            }
        },
    },
};