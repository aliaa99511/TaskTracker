import * as React from 'react';
import {
    FormControl, Typography, Autocomplete, AutocompleteProps,
    TextField, AutocompleteChangeReason, AutocompleteChangeDetails,
    ListItem, AutocompleteRenderInputParams
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatusChip from '../status_chip';

type CustomSelectFieldProps = {
    label: string;
    options: any;
    error?: boolean;
    helperText?: React.ReactNode;
    value: StatusOption | null;
} & Omit<AutocompleteProps<string, false, false, false>, 'renderInput' | 'options'>;

type StatusOption = {
    id: string;
    label: string;
    color: string;
};

const CustomStatusField = React.forwardRef<HTMLInputElement, CustomSelectFieldProps>(({ label, options, value, onChange, error, helperText, ...rest }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>("");

    return (
        <FormControl fullWidth error={error}>
            <Typography variant="caption">{label}</Typography>
            <Autocomplete
                popupIcon={<ExpandMoreIcon />}
                options={options}
                getOptionLabel={(option: any) => option.label}
                value={value ?? null}
                inputValue={inputValue}
                noOptionsText={"لا توجد خيارات"}
                isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                {...rest}
                onChange={(event: React.SyntheticEvent, newValue: string | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string>) => {
                    if (onChange) {
                        onChange(event, newValue, reason, details);
                    }
                }}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params: AutocompleteRenderInputParams) => {
                    const { InputProps, inputProps, ...restParams } = params;

                    return (
                        <TextField
                            inputRef={ref}
                            error={error}
                            helperText={helperText}
                            {...restParams}
                            autoComplete='off'
                            inputProps={{
                                ...inputProps,
                                style: { opacity: 0 },
                                readOnly: true,
                            }}
                            InputLabelProps={params.InputLabelProps}
                            InputProps={{
                                ...InputProps,
                                startAdornment: value ? <StatusChip status={value} /> : null,
                            }}
                        />
                    );
                }}
                renderOption={(props, option: StatusOption) => (
                    <ListItem {...props} key={option.label}>
                        <StatusChip status={option} />
                    </ListItem>
                )}
            />
        </FormControl>
    );
});

export default CustomStatusField;