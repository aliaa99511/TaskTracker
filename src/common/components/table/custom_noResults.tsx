import * as React from 'react';
import { Box } from '@mui/material';

export function CustomNoResultsOverlay() {
    return (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={200}>
            {"لم يتم العثور على نتائج"}
        </Box>
    );
}