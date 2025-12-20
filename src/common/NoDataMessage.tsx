import { Box, Typography } from "@mui/material";
import React from "react";

const NoDataMessage: React.FC<{ message: string }> = ({ message }) => (
    <Box
        sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary'
        }}
    >
        <Typography variant="h6" gutterBottom>
            {message}
        </Typography>
    </Box>
);

export default NoDataMessage