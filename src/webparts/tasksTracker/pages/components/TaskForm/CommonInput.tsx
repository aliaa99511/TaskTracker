import * as React from 'react';
import {
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText
} from '@mui/material';

// Base props
interface BaseInputProps {
    name: string;
    value: string | number;
    onChange: (value: string) => void;
    label: string;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    sx?: any;
}

// TextField specific props
interface TextInputProps extends BaseInputProps {
    type: 'text' | 'textarea';
    multiline?: boolean;
    rows?: number;
}

// Select specific props
interface SelectInputProps extends BaseInputProps {
    type: 'select';
    options: Array<{ value: string | number; label: string }>;
}

type CommonInputProps = TextInputProps | SelectInputProps;

const CommonInput: React.FC<CommonInputProps> = (props) => {
    const {
        name,
        value,
        onChange,
        label,
        error = false,
        helperText,
        required = false,
        disabled = false,
        sx,
        type,
    } = props;

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
        },
        ...sx,
    };

    if (type === 'select') {
        const { options } = props as SelectInputProps;

        return (
            <FormControl fullWidth sx={inputSx} error={error}>
                <InputLabel>
                    {label}{required ? ' *' : ''}
                </InputLabel>
                <Select
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value as string)}
                    label={label}
                    disabled={disabled}
                >
                    {options.map((option) => (
                        <MenuItem key={String(option.value)} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        );
    }

    // TextField
    const { multiline = false, rows } = props as TextInputProps;
    const isTextarea = type === 'textarea';

    return (
        <TextField
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
            label={label}
            error={error}
            helperText={helperText}
            required={required}
            multiline={isTextarea || multiline}
            rows={rows}
            disabled={disabled}
            sx={inputSx}
        />
    );
};

export default CommonInput;