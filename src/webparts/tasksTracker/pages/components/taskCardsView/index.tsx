import * as React from 'react';
import { Grid, Popover } from '@mui/material';
import TaskCard from './TaskCard';
import TaskComments from '../comments';

interface TaskCardsViewProps {
    tasks: any[];
    onEdit?: (task: any) => void;
    onDelete?: (id: number, title: string) => void;
    activeCommentRowId?: number | null;
    setActiveCommentRowId?: React.Dispatch<React.SetStateAction<number | null>>;
    commentAnchorEl?: HTMLButtonElement | null;
    setCommentAnchorEl?: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
    onCardClick?: (task: any) => void;
}

const TaskCardsView = ({
    tasks,
    onEdit,
    onDelete,
    activeCommentRowId,
    setActiveCommentRowId,
    commentAnchorEl,
    setCommentAnchorEl,
    onCardClick // Destructure it
}: TaskCardsViewProps) => {
    const handleCloseComment = () => {
        if (setActiveCommentRowId) {
            setActiveCommentRowId(null);
        }
        if (setCommentAnchorEl) {
            setCommentAnchorEl(null);
        }
    };

    const handleCardClick = (task: any) => {
        if (onCardClick) {
            onCardClick(task);
        }
    };

    return (
        <>
            <Grid container spacing={2}>
                {tasks.map((task: any) => (
                    <Grid item xs={12} md={4} key={task.ID}>
                        <div onClick={() => handleCardClick(task)}>
                            <TaskCard
                                task={task}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                activeCommentRowId={activeCommentRowId}
                                setActiveCommentRowId={setActiveCommentRowId}
                                commentAnchorEl={commentAnchorEl}
                                setCommentAnchorEl={setCommentAnchorEl}
                            />
                        </div>
                    </Grid>
                ))}
            </Grid>

            {/* Shared Popover for all cards */}
            <Popover
                open={Boolean(activeCommentRowId && commentAnchorEl)}
                anchorEl={commentAnchorEl}
                onClose={handleCloseComment}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    sx: {
                        width: 320,
                        height: 350,
                        maxHeight: 350,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                    }
                }}
            >
                {activeCommentRowId && (
                    <TaskComments
                        taskId={activeCommentRowId}
                        onClose={handleCloseComment}
                    />
                )}
            </Popover>
        </>
    );
};

export default TaskCardsView;