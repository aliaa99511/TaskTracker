export const MuiButton = {
    styleOverrides: {
        root: () => ({
            minWidth: '120px',
            borderRadius: '8px',
            boxShadow: 'none',
            fontWeight: 400,
            lineHeight: 1.8,
            fontFamily: "Cairo !important",
            "&.MuiButton-root": {
                textTransform: 'capitalize',
            },
        }),
    },
};