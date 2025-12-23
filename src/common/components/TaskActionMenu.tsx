import * as React from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider } from '@mui/material';

interface TaskActionMenuProps {
    task: any;
    onEdit: (task: any) => void;
    onDelete: (taskId: number, taskTitle: string) => void;
}

const TaskActionMenu: React.FC<TaskActionMenuProps> = ({
    task,
    onEdit,
    onDelete,
}) => {
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
        onDelete(task.Id, task.Title);
        handleClose(event);
    };

    const menuStyles = {
        fontSize: 14,
        textAlign: 'center',
        mb: 1,
        borderRadius: 1.5,
        '&:hover': { backgroundColor: 'action.hover' },
    };

    return (
        <>
            <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        mt: 0.5,
                        minWidth: 160,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1,
                        pt: 0.5,
                    },
                }}
            >
                <MenuItem
                    onClick={handleEdit}
                    sx={{
                        ...menuStyles,
                    }}
                >
                    <ListItemText>تعديل</ListItemText>
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem
                    onClick={handleDelete}
                    sx={{
                        ...menuStyles,
                        color: 'error.main',
                        mb: 0,
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.error.main + '14',
                        },
                    }}
                >
                    <ListItemText>حذف</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default TaskActionMenu;
