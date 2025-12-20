import { lighten, type PaletteMode, type PaletteOptions } from "@mui/material";

const GetPalette = (palette: any, mode: PaletteMode): PaletteOptions => {
    return {
        mode,
        primary: {
            main: palette?.themePrimary || "#46ad6e",
            light: palette?.themePrimary || "#46ad6e",
            dark: palette?.themePrimary || "#46ad6e",
            contrastText: palette?.primaryBackground || "#fff",
        },
        secondary: {
            main: "#78909C",
            light: "#78909C",
            dark: "#78909C",
            contrastText: "#fff",
        },
        error: {
            main: mode == "dark" ? lighten("#c62828", .2) : "#c62828",
        },
    }
};

export default GetPalette;
