import { createTheme } from "@mui/material/styles";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

export const rtlTheme = createTheme({
    direction: "rtl",
    typography: {
        fontFamily: "Cairo, Arial, sans-serif",
    },
});

export const rtlCache = createCache({
    key: "mui-rtl",
    stylisPlugins: [rtlPlugin],
});
