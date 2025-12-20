import * as React from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskActionMenuProps {
    task: any;
    onEdit: (task: any) => void;
    onDelete: (taskId: number, taskTitle: string) => void; // Updated to accept taskTitle
}

const TaskActionMenu: React.FC<TaskActionMenuProps> = ({ task, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onEdit(task);
        handleClose(event);
    };

    const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        // Call onDelete with both taskId and taskTitle for the confirmation dialog
        onDelete(task.Id, task.Title);
        handleClose(event);
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={handleClick}
                sx={{ ml: 1 }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>تعديل المهمة</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>حذف المهمة</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default TaskActionMenu;