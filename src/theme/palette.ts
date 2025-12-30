import { lighten, type PaletteMode, type PaletteOptions } from "@mui/material";

const GetPalette = (palette: any, mode: PaletteMode): PaletteOptions => {
    return {
        mode,
        primary: {
            main: palette?.themePrimary || "#886A3D",
            light: palette?.themePrimary || "#886A3D",
            dark: palette?.themePrimary || "#886A3D",
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
