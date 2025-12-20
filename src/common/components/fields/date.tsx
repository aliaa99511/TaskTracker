import * as React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FormControl, Typography } from "@mui/material";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

type CustomDateFieldProps = {
    label: string;
    error?: boolean;
    helperText?: React.ReactNode;
} & DatePickerProps;

const CustomDateField = React.forwardRef<HTMLInputElement, CustomDateFieldProps>(
    ({ label, error, helperText, ...rest }, ref) => {

        return (
            <FormControl fullWidth>
                <Typography variant="caption">{label}</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en">
                    <DatePicker
                        format="DD-MM-YYYY"
                        {...rest}
                        slots={{ openPickerIcon: CalendarTodayRoundedIcon }}
                        slotProps={{
                            textField: {
                                inputRef: ref,
                                error,
                                helperText,
                            },
                        }}
                    />
                </LocalizationProvider>
            </FormControl>
        );
    }
);

export default CustomDateField;



