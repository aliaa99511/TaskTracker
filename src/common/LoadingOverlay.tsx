import * as React from 'react';
import { Box, CircularProgress } from "@mui/material";

const LoadingOverlay = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            gap: 2
        }}
    >
        <CircularProgress
            size={60}
            thickness={4}
            sx={{
                color: 'primary.main'
            }}
        />
    </Box>
);

export default LoadingOverlay;