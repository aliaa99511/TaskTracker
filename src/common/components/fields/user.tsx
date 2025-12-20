import * as React from 'react';
import {
    FormControl, Typography, Autocomplete, TextField,
    useTheme, AutocompleteProps, AutocompleteChangeReason,
    AutocompleteChangeDetails, ListItemAvatar, Avatar, ListItem, Stack,
    createFilterOptions, alpha,
    AutocompleteRenderInputParams,
    CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UserChip from '../user_chip';
import { stringAvatar } from '../../../utils/helpers';
import { useFetchUsersQuery } from '../../../store';


type CustomUserFieldProps = {
    label: string;
    exclude?: number[],
    error?: boolean;
    helperText?: React.ReactNode;
} & Omit<AutocompleteProps<string, false, false, false>, 'renderInput' | 'options'>;

const CustomUserField = React.forwardRef<HTMLInputElement, CustomUserFieldProps>(({ label, exclude, value, onChange, error, helperText, ...rest }, ref) => {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState('');
    const [usersList, setUsersList] = React.useState<any>([]);
    // const { data: users, isFetching } = useFetchUsersQuery(value ? '' : inputValue);
    const { data: users, isFetching } = useFetchUsersQuery('');
    const isDarkTheme = theme.palette.mode == "dark";

    React.useEffect(() => {
        if (users) {
            setUsersList(
                users.filter(user => user.Email != "" && !exclude?.includes(user.Id)).map(user => ({
                    id: user.Id,
                    label: user.Title,
                    email: user.Email
                }))
            );
        }
    }, [users]);

    return (
        <FormControl fullWidth error={error}>
            <Typography variant="caption">{label}</Typography>
            <Autocomplete
                popupIcon={<ExpandMoreIcon />}
                loading={isFetching}
                options={isFetching ? [] : usersList}
                getOptionLabel={(option: any) => option.label}
                value={value ?? null}
                inputValue={inputValue}
                noOptionsText={"لا توجد خيارات"}
                isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                {...rest}

                filterOptions={createFilterOptions({ stringify: (option: any) => `${option.label} ${option.email}` })}

                onChange={(event: React.SyntheticEvent, newValue: string | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string>) => {
                    if (onChange) {
                        onChange(event, newValue, reason, details);
                    }
                }}

                onInputChange={(_, newInputValue) => setInputValue(newInputValue)}

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
                                style: value ? { opacity: 0 } : {},
                            }}
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    startAdornment: value ? <UserChip userName={inputValue} /> : null,
                                    endAdornment: (
                                        <React.Fragment>
                                            {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                },
                            }}
                        />
                    );
                }}

                renderOption={(props, option: any) => (
                    <ListItem
                        {...props}
                        key={option.id}
                        sx={{
                            borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                            textAlign: theme.direction == "rtl" ? "right" : "left",
                            "&:last-child": { border: "none" }
                        }}>
                        <ListItemAvatar>
                            <Avatar  {...stringAvatar(option.label, isDarkTheme)} alt={option.label} />
                        </ListItemAvatar>
                        <Stack>
                            <Typography variant='body1'>{option.label}</Typography>
                            <Typography variant='body2'>{option.email}</Typography>
                        </Stack>
                    </ListItem>
                )}
            />
        </FormControl>
    );
});

export default CustomUserField;