import { alpha, type ChipProps, type Theme } from "@mui/material";

const MuiChip = {
  styleOverrides: {
    root: ({ ownerState, theme }: { ownerState: ChipProps; theme: Theme }) => {
      const color = ownerState.color || 'default';
      let bgColor;

      switch (color) {
        case 'primary':
          bgColor = theme.palette.primary.main;
          break;
        case 'secondary':
          bgColor = theme.palette.secondary.main;
          break;
        case 'success':
          bgColor = theme.palette.success.main;
          break;
        case 'error':
          bgColor = theme.palette.error.main;
          break;
        case 'warning':
          bgColor = theme.palette.warning.main;
          break;
        case 'info':
          bgColor = theme.palette.info.main;
          break;
        default:
          bgColor = theme.palette.grey[300];
      }

      return {
        backgroundColor: alpha(bgColor, 0.8),
        color: theme.palette.getContrastText(bgColor),
        // fontWeight: "600",
        borderRadius: "10px",
        padding: "2px .5rem",
        height: "30px"
      };
    },
  },
};
export default MuiChip;