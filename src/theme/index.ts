import { createTheme, type Theme } from '@mui/material/styles';

import typography from "./typography";
import components from "./components";
import GetPalette from "./palette";

const GetSiteTheme = (siteTheme: any): Theme => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const browserMode = isDarkMode ? "dark" : "light";

    const palette = GetPalette(siteTheme?.palette || {}, siteTheme?.mode || browserMode);

    return createTheme({
        direction: 'rtl',
        palette,
        typography: typography || {},
        components: components || {}
    });
};

export default GetSiteTheme;