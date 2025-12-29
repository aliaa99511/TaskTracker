import * as React from 'react';
import { Card, Typography, Chip, Box } from '@mui/material';
import TaskActionMenu from '../../../../../common/components/TaskActionMenu';
import { formatDate, getPriorityColor } from '../../../../../utils/helpers';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { alpha } from '@mui/material/styles';

const TaskCard = ({ task, onEdit, onDelete }: any) => (
    <Card
        sx={{
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
        }}
    >
        {/* Top row: title + menu */}
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                p: 1,
            }}
        >
            <Typography fontWeight={600} fontSize={16}>
                {task.Title}
            </Typography>
            <TaskActionMenu
                task={task}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task.ID, task.Title)}
            // onDelete={() => onDelete(task.ID, task.Title)}
            />
        </Box>
        <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

            {/* Responsible entity & Priority */}
            <Box mt={1} display="flex" gap={1} justifyContent="space-between" alignItems="center">
                <Typography fontSize={13} color="text.secondary" >
                    الجهة المسؤولة: {task.ConcernedEntity}
                </Typography>
                <Chip
                    size="small"
                    label={`أولوية ${task.Priority}`}
                    sx={{ ...getPriorityColor(task.Priority), fontSize: 12, fontWeight: 500 }}
                />
            </Box>

            <Box mt={1} display="flex" gap={1} justifyContent="space-between" alignItems="center">
                <Typography fontSize={13} color="text.secondary" >
                    الوصف: {task.Description}
                </Typography>
            </Box>

            {/* Due date + optional comment icon */}
            <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize={12} color="text.secondary">
                    موعد التسليم: {formatDate(task.DueDate)}
                </Typography>

                {task.NewCommentsCount > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            backgroundColor: '#F5F5F5',
                            px: 0.8,
                            py: 0.3,
                            borderRadius: 1,
                        }}
                    >
                        <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: 'gray' }} />
                        <Typography fontSize={12} color="gray">
                            {task.NewCommentsCount}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    </Card>
);

export default TaskCard;
