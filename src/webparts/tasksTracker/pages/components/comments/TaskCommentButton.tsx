import React from 'react';
import { IconButton, Box } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TextsmsIcon from '@mui/icons-material/Textsms';

interface TaskCommentButtonProps {
    taskId: number;
    commentsCount: number;
    isActive: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TaskCommentButton: React.FC<TaskCommentButtonProps> = ({
    taskId,
    commentsCount,
    isActive,
    onClick
}) => {
    return (
        <Box sx={{ position: 'relative' }}>
            <IconButton
                size="small"
                onClick={onClick}
                sx={{
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {/* <Badge
                    badgeContent={commentsCount || 0}
                    color="error"
                    max={99}
                > */}
                {commentsCount > 0 ? (
                    <TextsmsIcon
                        fontSize="small"
                        color={isActive ? "primary" : "action"}
                    />
                ) : (
                    <ChatBubbleOutlineIcon
                        fontSize="small"
                        color={isActive ? "primary" : "action"}
                    />
                )}
                {/* </Badge> */}
            </IconButton>
        </Box>
    );
};