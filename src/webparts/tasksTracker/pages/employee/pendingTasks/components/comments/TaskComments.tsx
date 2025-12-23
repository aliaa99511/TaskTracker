import * as React from 'react';
import {
    Box,
    Typography,
    Avatar,
    TextField
} from '@mui/material';

const TaskComments = ({ taskId }: { taskId: number }) => {
    const comments: any[] = []; // SharePoint later

    return (
        <Box sx={{ background: '#F7F4EF', p: 1.5, borderRadius: 2 }}>
            <Typography fontSize={14} fontWeight={500}>
                التعليقات
            </Typography>

            {comments.map(c => (
                <Box key={c.id} display="flex" gap={1} mt={1}>
                    <Avatar src={c.userImage} />
                    <Box>
                        <Typography fontSize={13}>{c.text}</Typography>
                        <Typography fontSize={11} color="gray">
                            {c.created}
                        </Typography>
                    </Box>
                </Box>
            ))}

            <TextField
                fullWidth
                size="small"
                placeholder="أضف تعليق..."
                sx={{ mt: 1 }}
            />
        </Box>
    );
};

export default TaskComments;
