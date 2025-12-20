import { alpha, Theme } from "@mui/material";

export const MuiPopper = {
    styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
            return {
                ...(theme.direction === "rtl" && {
                    '&.MuiAutocomplete-popper': {
                        direction: "rtl",
                    },
                    '& *': {
                        textSize: ".5rem !important"
                    },
                }),

                '&.MuiDataGrid-menu': {
                    '& .MuiPaper-root': {
                        borderRadius: 5,
                        boxShadow: theme.shadows[3],
                    },
                    '& .MuiDataGrid-menuList': {
                        padding: 0,
                        minWidth: '14rem'
                    },
                    '& hr': {
                        display: "none"
                    },
                    '& .MuiMenuItem-root': {
                        fontSize: '0.93rem',
                        fontWeight: 400,
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        // justifyContent: 'center',
                        borderBottom: '1px solid',
                        borderColor: alpha(theme.palette.secondary.main, .15),
                        '& .MuiListItemIcon-root': {
                            minWidth: '30px',
                        },
                        '& .MuiTypography-root': {
                            fontSize: '0.93rem',
                            fontWeight: 400,
                        },
                        '& .MuiButtonBase-root': {
                            padding: "0 !important",
                        },
                        '& svg': {
                            fontSize: '1.2rem'
                        },
                        ':last-child': {
                            border: "none"
                        },
                    }
                },
                '& .MuiDataGrid-filterForm .MuiFormControl-root': {
                    margin: "5px .5rem"
                },
                '& .MuiDataGrid-filterForm .MuiDataGrid-filterFormValueInput': {
                    width: "250px"
                }
            }
        },
    },
};