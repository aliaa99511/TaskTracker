import * as React from 'react';
import { alpha, Box, LinearProgress, Typography, useTheme } from "@mui/material";

export default function ProgressChip({ percentage }: { percentage: number }) {
    const theme = useTheme();

    return (
        <Box width="100%" height="100%" display="flex" alignItems="center">
            <Box width="100%" mr={1.5}>
                <LinearProgress
                    color={percentage > 0 ? 'primary' : 'secondary'}
                    variant="determinate"
                    value={percentage}
                    sx={{ height: 10, borderRadius: 2, background: percentage > 0 ? alpha(theme.palette.primary.main, .1) : alpha(theme.palette.secondary.main, .2) }}
                />
            </Box>
            <Box minWidth={35}>
                <Typography variant="caption" color={percentage > 0 ? 'primary' : 'secondary'} >
                    {Math.round(percentage)}%
                </Typography>
            </Box>
        </Box>
    );
}