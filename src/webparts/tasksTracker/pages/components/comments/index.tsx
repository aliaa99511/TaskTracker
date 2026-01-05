import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    CircularProgress,
    IconButton as CloseButton,
    Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useFetchTaskNotesQuery, useAddTaskCommentMutation } from '../../../../../store';
import { formatDate, hasRealNotes } from '../../../../../utils/helpers';
import CommentSkeleton from './CommentSkeleton';
import UserAvatar from './UserAvatar';

interface TaskCommentsProps {
    taskId: number;
    onClose?: () => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, onClose }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: comments = [], isLoading, refetch } = useFetchTaskNotesQuery(taskId);
    const [addComment] = useAddTaskCommentMutation();

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const commentWithUserInfo = `<div>${newComment}</div>`;

            await addComment({
                id: taskId,
                comment: commentWithUserInfo
            }).unwrap();

            setNewComment('');
            refetch();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredComments = comments.filter((item: any) => hasRealNotes(item.Notes));

    return (
        <Box sx={{
            background: '#F7F4EF',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            borderRadius: 2,
            overflow: 'hidden'
        }}>
            {/* Header - Fixed with close button */}
            <Box sx={{
                p: 1.5,
                pb: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography fontSize={14} fontWeight={500}>
                    التعليقات ({filteredComments.length})
                </Typography>
                {onClose && (
                    <Tooltip title="إغلاق">
                        <CloseButton
                            size="small"
                            onClick={onClose}
                            sx={{
                                padding: 0.5,
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </CloseButton>
                    </Tooltip>
                )}
            </Box>

            {/* Comments List - Scrollable */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                px: 1.5
            }}>
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <CommentSkeleton key={i} />
                    ))
                ) : filteredComments.length === 0 ? (
                    <Typography color="text.secondary" fontSize={12} textAlign="center" py={2}>
                        لا توجد تعليقات
                    </Typography>
                ) : (
                    filteredComments.map((comment: any, idx: any) => (
                        <Box
                            key={idx}
                            sx={{
                                mb: 2,
                                pb: 2,
                                borderBottom: idx < filteredComments.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <UserAvatar
                                    name={comment.Editor?.LookupValue || 'Unknown'}
                                    userMail={comment.Editor?.Email}
                                    size="24px"
                                    fontSize="12px"
                                />
                                <Box>
                                    <Typography fontSize={12} fontWeight={500}>
                                        {comment.Editor?.LookupValue || 'Unknown'}
                                    </Typography>
                                    <Typography fontSize={10} color="text.secondary">
                                        {formatDate(comment.Created)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                component="div"
                                fontSize={12}
                                sx={{
                                    '& p': { margin: 0 },
                                    '& div': { margin: 0 }
                                }}
                                dangerouslySetInnerHTML={{ __html: comment.Notes }}
                            />
                        </Box>
                    ))
                )}
            </Box>

            {/* Add Comment Form - Fixed at bottom */}
            <Box
                component="form"
                onSubmit={handleSubmitComment}
                sx={{
                    p: 1.5,
                    pt: 1,
                    background: '#F7F4EF',
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    flexShrink: 0
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="أضف تعليق..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmitting}
                    multiline
                    rows={2}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            background: '#fff',
                            fontSize: '12px'
                        }
                    }}
                />
                <Box display="flex" justifyContent="flex-end" mt={1}>
                    <IconButton
                        size="small"
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        sx={{
                            bgcolor: 'primary.main',
                            color: '#fff',
                            '&:hover': { bgcolor: 'primary.dark' },
                            '&:disabled': { bgcolor: 'grey.300' }
                        }}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <SendIcon fontSize="small" />
                        )}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default TaskComments;


