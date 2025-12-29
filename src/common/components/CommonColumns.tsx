import * as React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import {
    Chip,
    IconButton, Badge, Box
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { formatDate, getPriorityColor, getStatusColor } from '../../utils/helpers';
import TaskActionMenu from './TaskActionMenu';
import TaskComments from '../../webparts/tasksTracker/pages/components/comments/TaskComments';

export const getBaseColumns = ({ logType, onEdit, onDelete }: any): GridColDef[] => {
    const columns: GridColDef[] = [];

    if (logType !== 'employee') {
        columns.push({
            field: "Employee",
            headerName: "الإسم",
            flex: 0.8,
            renderCell: (p) => p.value?.Title || "-"
        });
    }

    columns.push({
        field: "Title",
        headerName: "المهمة",
        flex: 1
    });

    columns.push({
        field: "ConcernedEntity",
        headerName: "الجهة المسؤولة",
        flex: 0.6
    });
    if (logType !== 'employee') {
        columns.push({
            field: "Department",
            headerName: "القسم",
            flex: 0.6,
            renderCell: (p) => p.value?.Title || "-"
        });
    }
    columns.push({
        field: "TaskType",
        headerName: "نوع المهمة",
        flex: 0.5,
        renderCell: (p) => p.value?.Title || "-"
    });
    columns.push({
        field: "Status",
        headerName: "الحالة",
        flex: 0.6,
        renderCell: (p) => (
            <Chip label={p.value} size="small" sx={getStatusColor(p.value)} />
        )
    });
    columns.push({
        field: "Priority",
        headerName: "الأولوية",
        flex: 0.5,
        renderCell: (p) => (
            <Chip label={p.value} size="small" sx={getPriorityColor(p.value)} />
        )
    });

    columns.push({
        field: "DueDate",
        headerName: "موعد التسليم",
        flex: 0.5,
        renderCell: (p) => formatDate(p.value)
    });

    if (logType == 'employee') {
        columns.push({
            field: "Created",
            headerName: "تاريخ الانشاء",
            flex: 0.5,
            renderCell: (p) => formatDate(p.value)
        });
    }

    columns.push({
        field: "comments",
        headerName: "",
        flex: 0.3,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const [open, setOpen] = React.useState(false);

            return (
                <Box sx={{ position: 'relative' }} >
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        <Badge badgeContent={params.row.CommentsCount || 0} color="error">
                            <ChatBubbleOutlineIcon fontSize="small" />
                        </Badge>
                    </IconButton>

                    {open && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 5,
                                left: 32,
                                zIndex: 222220,
                                background: '#fff',
                                boxShadow: 4,
                                borderRadius: 2,
                                p: 1,
                                width: 320,
                                maxHeight: 400,
                                overflow: 'hidden'
                            }}
                        >
                            <TaskComments taskId={params.row.ID} />
                        </Box>
                    )}
                </Box>
            );
        }
    });

    if (onEdit && onDelete) {
        columns.push({
            field: "actions",
            headerName: "",
            flex: 0.3,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <TaskActionMenu
                    task={params.row}
                    onEdit={() => onEdit(params.row)}
                    onDelete={() => onDelete(params.row.ID, params.row.Title)}
                />
            )
        });
    }

    return columns;
};


export const getEmployeeColumns = (onEdit: any, onDelete: any) =>
    getBaseColumns({ logType: 'employee', onEdit, onDelete });

export const getManagerColumns = (onEdit: any, onDelete: any) =>
    getBaseColumns({ logType: 'manager' });
