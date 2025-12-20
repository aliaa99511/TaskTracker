import type { Components, Theme } from "@mui/material";
import MuiAppBar from "./componets/appBar";
import MuiDrawer from "./componets/drawer";
import MuiPaper from "./componets/paper";
import MuiTable from "./componets/table";
import { MuiButton } from "./componets/button";
import { MuiDialog, MuiDialogTitle } from "./componets/dialog";
import { MuiFormControl, MuiAutocomplete } from "./componets/fields";
import { MuiStepper, MuiStep, MuiStepLabel } from "./componets/stepper";
import { MuiPopper } from "./componets/popper";
// import { MuiMenu, MuiMenuItem } from "./componets/menu";




const components: Components<Theme> = {
  MuiButton,
  MuiTable,

  MuiFormControl,
  MuiAutocomplete,

  MuiAppBar,

  MuiPaper,

  MuiDialog,
  MuiDialogTitle,

  MuiDrawer,
  // MuiChip,

  MuiStepper,
  MuiStep,
  MuiStepLabel,

  MuiPopper,
  // MuiMenu,

  // MuiMenuItem
};

export default components;