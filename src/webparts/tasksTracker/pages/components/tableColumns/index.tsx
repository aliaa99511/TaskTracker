import * as React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Chip, Popover } from '@mui/material';
import { formatDate, getPriorityColor, getStatusColor, hasRealNotes } from '../../../../../utils/helpers';
import TaskActionMenu from '../../../../../common/components/TaskActionMenu';
import { TaskCommentButton } from '../comments/TaskCommentButton';
import TaskComments from '../comments';

export const getBaseColumns = ({
    logType,
    onEdit,
    onDelete,
    activeCommentRowId,
    setActiveCommentRowId
}: any): GridColDef[] => {
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

    // columns.push({
    //     field: "ConcernedEntity",
    //     headerName: "الجهة المسؤولة",
    //     flex: 0.6
    // });

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
        flex: 0.7,
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
        flex: 0.4,
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

    columns.push({
        field: "Created",
        headerName: "تاريخ الانشاء",
        flex: 0.5,
        renderCell: (p) => formatDate(p.value)
    });

    columns.push({
        field: "comments",
        headerName: "",
        flex: 0.3,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const hasComments = hasRealNotes(params.row.Notes);
            const isActive = activeCommentRowId === params.row.ID;
            const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
            const anchorElRef = React.useRef<HTMLButtonElement | null>(null);

            // Handle click to set anchor element
            const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();

                if (isActive) {
                    setActiveCommentRowId(null);
                    setAnchorEl(null);
                    anchorElRef.current = null;
                } else {
                    setActiveCommentRowId(params.row.ID);
                    setAnchorEl(event.currentTarget);
                    anchorElRef.current = event.currentTarget;
                }
            };

            // Handle popover close
            const handleClose = () => {
                setActiveCommentRowId(null);
                setAnchorEl(null);
                anchorElRef.current = null;
            };

            // Keep anchorEl in sync with active state
            React.useEffect(() => {
                if (!isActive) {
                    setAnchorEl(null);
                    anchorElRef.current = null;
                }
            }, [isActive]);

            return (
                <>
                    <TaskCommentButton
                        taskId={params.row.ID}
                        commentsCount={hasComments ? 1 : 0} // Use 1 if there are notes, 0 otherwise
                        isActive={isActive}
                        onClick={handleClick}
                    />
                    <Popover
                        open={isActive && !!anchorEl}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        disableAutoFocus
                        disableEnforceFocus
                        disableRestoreFocus
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
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        <TaskComments taskId={params.row.ID} onClose={handleClose} />
                    </Popover>
                </>
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

export const getEmployeeColumns = (
    onEdit?: any,
    onDelete?: any,
    activeCommentRowId?: number | null,
    setActiveCommentRowId?: React.Dispatch<React.SetStateAction<number | null>>
) => getBaseColumns({
    logType: 'employee',
    onEdit,
    onDelete,
    activeCommentRowId,
    setActiveCommentRowId
});

export const getManagerColumns = (
    onEdit?: any,
    onDelete?: any,
    activeCommentRowId?: number | null,
    setActiveCommentRowId?: React.Dispatch<React.SetStateAction<number | null>>
) => getBaseColumns({
    logType: 'manager',
    onEdit,
    onDelete,
    activeCommentRowId,
    setActiveCommentRowId
});