import * as React from 'react';
import { alpha, Box, Button, Grid2 as Grid, IconButton, lighten, useTheme } from "@mui/material";
import { AddCircleOutlineRounded } from '@mui/icons-material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useFieldArray } from 'react-hook-form';

export default function AddMoreButton({ label, formScheme, formSchemeName, repetedComponent }: { label: string, formScheme: object, formSchemeName: string, repetedComponent: any }) {
    const theme = useTheme();
    const { fields, append, remove } = useFieldArray({
        name: formSchemeName,
    });

    return (
        <>
            {fields.map((item, index) => (
                <Box key={index} sx={{ width: "100%", margin: "10px 0" }}>
                    <Grid container spacing={3} alignItems={"flex-end"}>
                        <Grid size={index == 0 ? 12 : 11}>
                            {repetedComponent(index)}
                        </Grid>
                        <Grid size={1}>
                            {index > 0 && (
                                <IconButton
                                    onClick={() => remove(index)}
                                    sx={{
                                        backgroundColor: lighten(theme.palette.error.main, .9),
                                        color: theme.palette.error.main,
                                    }}
                                >
                                    <DeleteRoundedIcon fontSize='small' />
                                </IconButton>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            ))}

            <Button
                fullWidth
                size='large'
                onClick={() => append(formScheme)}
                sx={{
                    margin: ".5rem 0",
                    padding: ".75rem",
                    backgroundColor: alpha(theme.palette.primary.main, .1),
                    fontWeight: 500,
                    borderRadius: "8px"
                }}
            >
                <AddCircleOutlineRounded sx={{
                    fontSize: "20px",
                    margin: "0 5px"
                }} />
                {label}
            </Button>

        </>
    );
}
