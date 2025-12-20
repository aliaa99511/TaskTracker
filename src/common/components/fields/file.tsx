import * as React from 'react';
import { FormControl, Typography, TextField, Box, useTheme, TextFieldProps, Stack, Button, alpha } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';

import FileIcon from '../file_icon';

type CustomFileFieldProps = {
    label: string;
    error?: boolean;
    info?: string;
    value: any;
    helperText?: React.ReactNode;
} & TextFieldProps;

const CustomFileField = React.forwardRef<HTMLInputElement, CustomFileFieldProps>(
    ({ label, info, error, helperText, value, onChange, ...rest }, ref) => {
        const theme = useTheme();
        const BG_Color = alpha(theme.palette.primary.main, 0.03);
        const Border_Color = alpha(theme.palette.primary.main, 0.6);
        const Icon_Color = alpha(theme.palette.primary.main, 0.9);
        const SelectedFiles = value ? value : [];
        const HasSelectedFiles = SelectedFiles.length > 0 && !error;
        const FileFieldDescription = "أو انقر ;للاختيار من الجهاز"
        const upload_help_text = FileFieldDescription.split(";");

        const OpenFile = (file: File) => {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        }

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

                <Box sx={{ backgroundColor: BG_Color, padding: 2, borderRadius: "6px" }}>
                    <Box
                        sx={{
                            position: "relative",
                            border: "2px solid transparent",
                            borderImage: `repeating-linear-gradient(45deg, ${error ? theme.palette.error.main : Border_Color} 0 5px, transparent 5px 10px)`,
                            borderImageSlice: 1,
                            borderRadius: "4px",
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="center" padding={2}>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    background: "white",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50px",
                                    boxShadow: "1px 1px 3px rgba(0,0,0,.1)",
                                    margin: "0 1rem",
                                }}
                            >
                                {!HasSelectedFiles && <DescriptionOutlinedIcon fontSize="small" color="primary" />}
                                {HasSelectedFiles && <AutorenewOutlinedIcon color="primary" />}
                            </Box>
                            <Box>
                                {!HasSelectedFiles && <Typography variant="body1">{"اسحب ملفاتك هنا"}</Typography>}
                                {HasSelectedFiles && <Typography variant="body1">{"اسحب ملفاتك هنا لتغيير الملفات المحددة"}</Typography>}
                                <Typography variant="body2">
                                    {upload_help_text[0]}{" "}
                                    <Typography variant="body2" component="span" sx={{ color: theme.palette.info.main, textDecoration: "underline" }}>
                                        {upload_help_text[1]}
                                    </Typography>
                                </Typography>
                            </Box>
                        </Box>
                        <TextField
                            type="file"
                            inputRef={ref}
                            {...rest}
                            onChange={onChange}
                            autoComplete='off'
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "100% !important",
                                width: "100%",
                                cursor: "pointer",
                                opacity: 0,
                                "& .MuiInputBase-input, & .MuiInputBase-root": {
                                    height: "100% !important",
                                    padding: "0 !important",
                                    cursor: "pointer",
                                },
                            }}
                        />
                    </Box>
                </Box>
                {error && (
                    <Typography variant="body1" fontSize={12} padding={"2px 1rem"} color="error">
                        {helperText}
                    </Typography>
                )}

                {HasSelectedFiles && <Stack spacing={1} margin={"10px 0"}>
                    {SelectedFiles.map((file: any, index: number) =>
                        <Button
                            key={index}
                            variant='outlined'
                            onClick={() => OpenFile(file)}
                            startIcon={<FileIcon fileName={file.name} commonProps={{ fontSize: 'small', sx: { color: Icon_Color, margin: "0 10px" } }} />}
                            sx={{ alignItems: "center", justifyContent: "flex-start", borderRadius: "3px", }}
                        >
                            {file.name}
                        </Button>
                    )}
                </Stack>}

            </FormControl>
        );
    }
);

export default CustomFileField;