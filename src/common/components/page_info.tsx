import * as React from 'react';
import { Box, Typography } from "@mui/material";

export default function PageInfo({ title, description }: { title: string; description?: string; }) {
    return (
        <Box mb={1}>
            <Typography color='primary' variant='h6'> {title}</Typography>
            {description && <Typography variant='caption'> {description}</Typography>}
        </Box>
    );
}