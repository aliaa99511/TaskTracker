import * as React from 'react';
import { Card, Typography, Chip, Box, IconButton } from '@mui/material';
import TaskActionMenu from '../../../../../common/components/TaskActionMenu';
import { formatDate, getPriorityColor, hasRealNotes } from '../../../../../utils/helpers';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TextsmsIcon from '@mui/icons-material/Textsms';

interface TaskCardProps {
    task: any;
    onEdit?: (task: any) => void;
    onDelete?: (id: number, title: string) => void;
    activeCommentRowId?: number | null;
    setActiveCommentRowId?: React.Dispatch<React.SetStateAction<number | null>>;
    commentAnchorEl?: HTMLButtonElement | null;
    setCommentAnchorEl?: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

const TaskCard = ({
    task,
    onEdit,
    onDelete,
    activeCommentRowId,
    setActiveCommentRowId,
    commentAnchorEl,
    setCommentAnchorEl
}: TaskCardProps) => {
    const hasComments = hasRealNotes(task.Notes);
    const isActive = activeCommentRowId === task.ID;

    const handleToggleComment = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!setActiveCommentRowId || !setCommentAnchorEl) return;

        event.stopPropagation(); // Prevent card click when clicking comment icon

        if (activeCommentRowId === task.ID) {
            setActiveCommentRowId(null);
            setCommentAnchorEl(null);
        } else {
            setActiveCommentRowId(task.ID);
            setCommentAnchorEl(event.currentTarget);
        }
    };

    const handleEditClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (onEdit) onEdit(task);
    };

    const handleDeleteClick = (id: number, title: string) => {
        // This now matches what TaskActionMenu expects
        if (onDelete) onDelete(id, title);
    };

    return (
        <Card
            sx={{
                borderRadius: 3,
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
            }}
        >
            {/* Top row: title + menu */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    backgroundColor: (theme) => theme.palette.primary.main + '10',
                    p: 1,
                }}
            >
                <Typography fontWeight={600} fontSize={16}>
                    {task.Title}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    {/* Comment Button for Card View */}
                    {setActiveCommentRowId && setCommentAnchorEl && (
                        <IconButton
                            size="small"
                            onClick={handleToggleComment}
                            sx={{
                                color: isActive ? 'primary.main' : 'inherit'
                            }}
                        >
                            {hasComments ? (
                                <TextsmsIcon fontSize="small" />
                            ) : (
                                <ChatBubbleOutlineIcon fontSize="small" />
                            )}
                        </IconButton>
                    )}
                    {onEdit && onDelete && (
                        <TaskActionMenu
                            task={task}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    )}
                </Box>
            </Box>

            <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Responsible entity & Priority */}
                <Box mt={1} display="flex" gap={1} justifyContent="space-between" alignItems="center">
                    <Typography fontSize={13} color="text.secondary" >
                        القسم: {task?.Department?.Title}
                    </Typography>
                    <Chip
                        size="small"
                        label={`أولوية ${task.Priority}`}
                        sx={{ ...getPriorityColor(task.Priority), fontSize: 12, fontWeight: 500 }}
                    />
                </Box>
                <Box mt={1} display="flex" gap={1} justifyContent="space-between" alignItems="center">
                    <Typography fontSize={13} color="text.secondary" >
                        الموظف: {task?.Employee?.Title}
                    </Typography>
                </Box>
                <Box mt={1} display="flex" gap={1} justifyContent="space-between" alignItems="center">
                    <Typography fontSize={13} color="text.secondary" >
                        تاريخ الإنشاء: {formatDate(task.Created)}
                    </Typography>
                </Box>
                {/* Due date + optional comment icon */}
                <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={12} color="text.secondary">
                        موعد التسليم: {formatDate(task.DueDate)}
                    </Typography>

                    {hasComments && (
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
                            <TextsmsIcon sx={{ fontSize: 14, color: 'gray' }} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Card>
    );
};
export default TaskCard;