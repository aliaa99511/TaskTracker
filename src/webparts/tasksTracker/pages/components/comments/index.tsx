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
import { formatDate } from '../../../../../utils/helpers';
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

    const hasRealNotes = (html: string | null) => {
        if (!html) return false;
        const text = html.replace(/<[^>]*>/g, "").trim();
        return text.length > 0;
    };

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













// import React, { useState } from 'react';
// import {
//     Box,
//     Typography,
//     TextField,
//     IconButton,
//     CircularProgress,
//     IconButton as CloseButton,
//     Tooltip,
//     Menu,
//     MenuItem,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     Button,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import CloseIcon from '@mui/icons-material/Close';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import {
//     useFetchTaskNotesQuery,
//     useUpdateTaskCommentMutation,
//     useDeleteTaskCommentMutation,
//     useFetchCurrentUserInfoQuery,
//     useAddTaskCommentMutation
// } from '../../../../../store';
// import { formatDate } from '../../../../../utils/helpers';
// import CommentSkeleton from './CommentSkeleton';
// import UserAvatar from './UserAvatar';

// interface TaskCommentsProps {
//     taskId: number;
//     onClose?: () => void;
// }

// interface CommentItem {
//     ID: number;
//     VersionId: number;
//     Notes: string;
//     Created: string;
//     Editor: {
//         LookupId: number;
//         Id: number;
//         Title: string;
//         EMail: string;
//     };
// }

// const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, onClose }) => {
//     const [newComment, setNewComment] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [editingComment, setEditingComment] = useState<CommentItem | null>(null);
//     const [editText, setEditText] = useState('');
//     const [commentToDelete, setCommentToDelete] = useState<CommentItem | null>(null);

//     // Menu state for each comment
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//     const [selectedComment, setSelectedComment] = useState<CommentItem | null>(null);

//     const { data: comments = [], isLoading, refetch } = useFetchTaskNotesQuery(taskId);
//     const { data: currentUser } = useFetchCurrentUserInfoQuery();
//     const [addComment] = useAddTaskCommentMutation();
//     const [updateComment] = useUpdateTaskCommentMutation();
//     const [deleteComment] = useDeleteTaskCommentMutation();

//     const hasRealNotes = (html: string | null) => {
//         if (!html) return false;
//         const text = html.replace(/<[^>]*>/g, "").trim();
//         return text.length > 0;
//     };

//     const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, comment: CommentItem) => {
//         event.stopPropagation();
//         setAnchorEl(event.currentTarget);
//         setSelectedComment(comment);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//         setSelectedComment(null);
//     };

//     const handleEditClick = () => {
//         if (selectedComment) {
//             setEditingComment(selectedComment);
//             // Extract text from HTML comment
//             const text = selectedComment.Notes.replace(/<[^>]*>/g, "").trim();
//             setEditText(text);
//             handleMenuClose();
//         }
//     };

//     const handleDeleteClick = () => {
//         if (selectedComment) {
//             setCommentToDelete(selectedComment);
//             handleMenuClose();
//         }
//     };

//     const handleEditSubmit = async () => {
//         if (!editingComment || !editText.trim() || isSubmitting) return;

//         try {
//             setIsSubmitting(true);
//             const commentWithUserInfo = `<div>${editText}</div>`;

//             await updateComment({
//                 taskId,
//                 versionId: editingComment.VersionId,
//                 comment: commentWithUserInfo
//             }).unwrap();

//             setEditingComment(null);
//             setEditText('');
//             refetch();
//         } catch (error) {
//             console.error('Error updating comment:', error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleDeleteConfirm = async () => {
//         if (!commentToDelete || isSubmitting) return;

//         try {
//             setIsSubmitting(true);
//             await deleteComment({
//                 taskId,
//                 versionId: commentToDelete.VersionId
//             }).unwrap();

//             setCommentToDelete(null);
//             refetch();
//         } catch (error) {
//             console.error('Error deleting comment:', error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleSubmitComment = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!newComment.trim() || isSubmitting) return;

//         try {
//             setIsSubmitting(true);
//             const commentWithUserInfo = `<div>${newComment}</div>`;

//             await addComment({
//                 id: taskId,
//                 comment: commentWithUserInfo
//             }).unwrap();

//             setNewComment('');
//             refetch();
//         } catch (error) {
//             console.error('Error adding comment:', error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const isCurrentUserComment = (comment: CommentItem) => {
//         console.log('comment', comment)
//         console.log('currentUser.Id', currentUser.Id)
//         return currentUser && comment.Editor?.LookupId === currentUser.Id;
//     };

//     const filteredComments = comments.filter((item: CommentItem) => hasRealNotes(item.Notes));

//     return (
//         <Box sx={{
//             background: '#F7F4EF',
//             display: 'flex',
//             flexDirection: 'column',
//             height: '100%',
//             borderRadius: 2,
//             overflow: 'hidden'
//         }}>
//             {/* Header - Fixed with close button */}
//             <Box sx={{
//                 p: 1.5,
//                 pb: 1,
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center'
//             }}>
//                 <Typography fontSize={14} fontWeight={500}>
//                     التعليقات ({filteredComments.length})
//                 </Typography>
//                 {onClose && (
//                     <Tooltip title="إغلاق">
//                         <CloseButton
//                             size="small"
//                             onClick={onClose}
//                             sx={{
//                                 padding: 0.5,
//                                 '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
//                             }}
//                         >
//                             <CloseIcon fontSize="small" />
//                         </CloseButton>
//                     </Tooltip>
//                 )}
//             </Box>

//             {/* Comments List - Scrollable */}
//             <Box sx={{
//                 flex: 1,
//                 overflow: 'auto',
//                 px: 1.5
//             }}>
//                 {isLoading ? (
//                     Array.from({ length: 2 }).map((_, i) => (
//                         <CommentSkeleton key={i} />
//                     ))
//                 ) : filteredComments.length === 0 ? (
//                     <Typography color="text.secondary" fontSize={12} textAlign="center" py={2}>
//                         لا توجد تعليقات
//                     </Typography>
//                 ) : (
//                     filteredComments.map((comment: CommentItem, idx: number) => (
//                         <Box
//                             key={`${comment.ID}-${comment.VersionId}`}
//                             sx={{
//                                 mb: 2,
//                                 pb: 2,
//                                 borderBottom: idx < filteredComments.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
//                                 position: 'relative',
//                                 '&:hover': {
//                                     backgroundColor: 'rgba(0,0,0,0.02)',
//                                     borderRadius: 1
//                                 }
//                             }}
//                         >
//                             <Box display="flex" alignItems="center" gap={1} mb={1}>
//                                 <UserAvatar
//                                     name={comment.Editor?.Title || 'Unknown'}
//                                     userMail={comment.Editor?.EMail}
//                                     size="24px"
//                                     fontSize="12px"
//                                 />
//                                 <Box sx={{ flex: 1 }}>
//                                     <Typography fontSize={12} fontWeight={500}>
//                                         {comment.Editor?.Title || 'Unknown'}
//                                     </Typography>
//                                     <Typography fontSize={10} color="text.secondary">
//                                         {formatDate(comment.Created)}
//                                     </Typography>
//                                 </Box>

//                                 {/* Edit/Delete Menu - Only show for comment owner */}
//                                 {isCurrentUserComment(comment) && (
//                                     <>
//                                         <IconButton
//                                             size="small"
//                                             onClick={(e) => handleMenuOpen(e, comment)}
//                                             sx={{ padding: 0.5 }}
//                                         >
//                                             <MoreVertIcon fontSize="small" />
//                                         </IconButton>
//                                         <Menu
//                                             anchorEl={anchorEl}
//                                             open={Boolean(anchorEl && selectedComment?.VersionId === comment.VersionId)}
//                                             onClose={handleMenuClose}
//                                             anchorOrigin={{
//                                                 vertical: 'bottom',
//                                                 horizontal: 'left',
//                                             }}
//                                             transformOrigin={{
//                                                 vertical: 'top',
//                                                 horizontal: 'left',
//                                             }}
//                                         >
//                                             <MenuItem onClick={handleEditClick}>
//                                                 <EditIcon fontSize="small" sx={{ mr: 1 }} />
//                                                 تعديل
//                                             </MenuItem>
//                                             <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
//                                                 <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
//                                                 حذف
//                                             </MenuItem>
//                                         </Menu>
//                                     </>
//                                 )}
//                             </Box>
//                             <Typography
//                                 variant="body2"
//                                 color="text.secondary"
//                                 component="div"
//                                 fontSize={12}
//                                 sx={{
//                                     '& p': { margin: 0 },
//                                     '& div': { margin: 0 }
//                                 }}
//                                 dangerouslySetInnerHTML={{ __html: comment.Notes }}
//                             />
//                         </Box>
//                     ))
//                 )}
//             </Box>

//             {/* Add/Edit Comment Form */}
//             {editingComment ? (
//                 <Box
//                     component="form"
//                     onSubmit={(e) => {
//                         e.preventDefault();
//                         handleEditSubmit();
//                     }}
//                     sx={{
//                         p: 1.5,
//                         pt: 1,
//                         background: '#F7F4EF',
//                         borderTop: '1px solid rgba(0,0,0,0.1)',
//                         flexShrink: 0
//                     }}
//                 >
//                     <Typography fontSize={12} fontWeight={500} mb={1}>
//                         تعديل التعليق
//                     </Typography>
//                     <TextField
//                         fullWidth
//                         size="small"
//                         placeholder="عدل التعليق..."
//                         value={editText}
//                         onChange={(e) => setEditText(e.target.value)}
//                         disabled={isSubmitting}
//                         multiline
//                         rows={2}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 background: '#fff',
//                                 fontSize: '12px'
//                             }
//                         }}
//                     />
//                     <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
//                         <Button
//                             size="small"
//                             onClick={() => {
//                                 setEditingComment(null);
//                                 setEditText('');
//                             }}
//                             disabled={isSubmitting}
//                             sx={{ fontSize: '12px' }}
//                         >
//                             إلغاء
//                         </Button>
//                         <Button
//                             size="small"
//                             type="submit"
//                             variant="contained"
//                             disabled={!editText.trim() || isSubmitting}
//                             sx={{ fontSize: '12px' }}
//                         >
//                             {isSubmitting ? (
//                                 <CircularProgress size={16} color="inherit" />
//                             ) : (
//                                 'حفظ'
//                             )}
//                         </Button>
//                     </Box>
//                 </Box>
//             ) : (
//                 <Box
//                     component="form"
//                     onSubmit={handleSubmitComment}
//                     sx={{
//                         p: 1.5,
//                         pt: 1,
//                         background: '#F7F4EF',
//                         borderTop: '1px solid rgba(0,0,0,0.1)',
//                         flexShrink: 0
//                     }}
//                 >
//                     <TextField
//                         fullWidth
//                         size="small"
//                         placeholder="أضف تعليق..."
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         disabled={isSubmitting}
//                         multiline
//                         rows={2}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 background: '#fff',
//                                 fontSize: '12px'
//                             }
//                         }}
//                     />
//                     <Box display="flex" justifyContent="flex-end" mt={1}>
//                         <IconButton
//                             size="small"
//                             type="submit"
//                             disabled={!newComment.trim() || isSubmitting}
//                             sx={{
//                                 bgcolor: 'primary.main',
//                                 color: '#fff',
//                                 '&:hover': { bgcolor: 'primary.dark' },
//                                 '&:disabled': { bgcolor: 'grey.300' }
//                             }}
//                         >
//                             {isSubmitting ? (
//                                 <CircularProgress size={16} color="inherit" />
//                             ) : (
//                                 <SendIcon fontSize="small" />
//                             )}
//                         </IconButton>
//                     </Box>
//                 </Box>
//             )}

//             {/* Delete Confirmation Dialog */}
//             <Dialog
//                 open={Boolean(commentToDelete)}
//                 onClose={() => !isSubmitting && setCommentToDelete(null)}
//             >
//                 <DialogTitle fontSize={14}>تأكيد الحذف</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText fontSize={12}>
//                         هل أنت متأكد من رغبتك في حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={() => setCommentToDelete(null)}
//                         disabled={isSubmitting}
//                         size="small"
//                     >
//                         إلغاء
//                     </Button>
//                     <Button
//                         onClick={handleDeleteConfirm}
//                         color="error"
//                         variant="contained"
//                         disabled={isSubmitting}
//                         size="small"
//                     >
//                         {isSubmitting ? (
//                             <CircularProgress size={16} color="inherit" />
//                         ) : (
//                             'حذف'
//                         )}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default TaskComments;