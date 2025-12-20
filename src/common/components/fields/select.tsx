import * as React from 'react';
import { FormControl, Typography, Autocomplete, AutocompleteProps, TextField, AutocompleteChangeReason, AutocompleteChangeDetails, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type CustomSelectFieldProps = {
    label: string;
    options: any;
    error?: boolean;
    loading?: boolean;
    info?: string;
    helperText?: React.ReactNode;
} & Omit<AutocompleteProps<string, false, boolean, false>, 'renderInput' | 'options'>;

const CustomSelectField = React.forwardRef<HTMLInputElement, CustomSelectFieldProps>(({ label, options, loading, value, info, onChange, error, helperText, ...rest }, ref) => {
    const [inputValue, setInputValue] = React.useState('');

    return (
        <FormControl fullWidth error={error}>
            <Typography variant="caption" component="label">
                {label}{" "}
                {info && (
                    <Typography variant="caption" component="span" sx={{ color: 'text.secondary' }}>
                        ({info})
                    </Typography>
                )}
            </Typography>
            <Autocomplete
                popupIcon={<ExpandMoreIcon />}
                options={!loading ? options : []}
                value={value ?? null}
                inputValue={inputValue}
                noOptionsText={"لا توجد خيارات"}
                isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                loading={loading}
                {...rest}
                onChange={(event: React.SyntheticEvent, newValue: string | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string>) => {
                    if (onChange) {
                        onChange(event, newValue, reason, details);
                    }
                }}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        inputRef={ref}
                        error={error}
                        helperText={helperText}
                        autoComplete='off'
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            },
                        }}
                    />
                )}
            />
        </FormControl>
    );
});

export default CustomSelectField;