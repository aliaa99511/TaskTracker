import React from 'react';
import { Box, Skeleton } from '@mui/material';

const CommentSkeleton: React.FC = () => {
    return (
        <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Skeleton variant="circular" width={24} height={24} />
                <Box flex={1}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                </Box>
            </Box>
            <Skeleton variant="rounded" width="100%" height={40} />
        </Box>
    );
};

export default CommentSkeleton;