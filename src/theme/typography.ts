import { Palette } from '@mui/material/styles';
import { alpha } from "@mui/material";

const typography = (palette: Palette) => {
  return {
    fontFamily: "Cairo, Roboto, Arial, sans-serif",
    body1: {
      fontWeight: 480,
    },
    body2: {
      fontWeight: 400,
      color: alpha(palette.text.secondary, .4)
    },
    h5: {
      lineHeight: 1.8,
      fontSize: "1.3rem",
      fontWeight: "500 !important",
    },
    caption: {
      marginBottom: "2px",
      fontWeight: 450,
      fontSize: ".85rem"
    }
  }
};

export default typography;
