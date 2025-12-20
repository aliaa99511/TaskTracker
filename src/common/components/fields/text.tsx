import * as React from 'react';
import { FormControl, TextField, TextFieldProps, Typography } from '@mui/material';

type CustomTextFieldProps = {
    label: string;
    type: string;
    info?: string;
} & TextFieldProps;

const CustomTextField = React.forwardRef<HTMLInputElement, CustomTextFieldProps>(({ label, type, info, ...rest }, ref) => {
    return (
        <FormControl fullWidth>
            <Typography variant="caption" component="label">
                {label}{" "}
                {info && (
                    <Typography variant="caption" component="span" sx={{ color: 'text.secondary' }}>
                        ({info})
                    </Typography>
                )}
            </Typography>
            <TextField
                // autoComplete='off'
                type={type}
                inputRef={ref}
                {...rest}
            />
        </FormControl>

    );
}
);

export default CustomTextField;