import * as React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import {
    Chip,
    // IconButton, Badge, Box 
} from '@mui/material';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { formatDate, getPriorityColor, getStatusColor } from '../../utils/helpers';
import TaskActionMenu from './TaskActionMenu';
// import TaskComments from '../../webparts/tasksTracker/pages/employee/pendingTasks/components/comments/TaskComments';

export const getBaseColumns = ({ logType, type, onEdit, onDelete }: any): GridColDef[] => {
    const columns: GridColDef[] = [];

    if (logType !== 'employee') {
        columns.push({
            field: "Employee",
            headerName: "الإسم",
            flex: 0.5,
            renderCell: (p) => p.value?.Title || "-"
        });
    }

    if (type !== 'pending') {
        columns.push({
            field: "Status",
            headerName: "الحالة",
            flex: 0.6,
            renderCell: (p) => (
                <Chip label={p.value} size="small" sx={getStatusColor(p.value)} />
            )
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
        flex: 0.7
    });

    columns.push({
        field: "TaskType",
        headerName: "نوع المهمة",
        flex: 0.7,
        renderCell: (p) => p.value?.Title || "-"
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

    // ✅ COMMENTS COLUMN
    // columns.push({
    //     field: "comments",
    //     headerName: "",
    //     flex: 0.3,
    //     sortable: false,
    //     filterable: false,
    //     renderCell: (params) => {
    //         const [open, setOpen] = React.useState(false);

    //         return (
    //             <>
    //                 <IconButton size="small" onClick={() => setOpen(!open)}>
    //                     <Badge badgeContent={params.row.CommentsCount || 0} color="error">
    //                         <ChatBubbleOutlineIcon fontSize="small" />
    //                     </Badge>
    //                 </IconButton>

    //                 {open && (
    //                     <Box
    //                         sx={{
    //                             position: 'absolute',
    //                             zIndex: 20,
    //                             background: '#fff',
    //                             boxShadow: 4,
    //                             borderRadius: 2,
    //                             p: 1,
    //                             width: 280
    //                         }}
    //                     >
    //                         <TaskComments taskId={params.row.ID} />
    //                     </Box>
    //                 )}
    //             </>
    //         );
    //     }
    // });

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

export const getEmployeePendingColumns = (onEdit: any, onDelete: any) =>
    getBaseColumns({ logType: 'employee', type: 'pending', onEdit, onDelete });











// import * as React from 'react';
// import { Chip } from '@mui/material';
// import { GridColDef } from '@mui/x-data-grid';
// import { getPriorityColor, getStatusColor } from '../../utils/helpers';
// import TaskActionMenu from './TaskActionMenu';

// export const getColumns = (
//     LogType: string,
//     // Type?: string,
//     // isManager?: boolean,
// ): GridColDef[] => {
//     const baseColumns: GridColDef[] = [
//         // ...(LogType !== 'employee' ? [
//         {
//             field: "Employee",
//             headerName: "الإسم",
//             flex: .5,
//             renderCell: (params: any) => {
//                 return params.value?.Title || "-";
//             },
//         },
//         // ] : []),

//         // ...(Type !== 'Pending' ? [
//         {
//             field: "Status",
//             headerName: "الحالة",
//             flex: .6,
//             renderCell: (params: any) => {
//                 const status = params.value;
//                 const styles = getStatusColor(status);

//                 return (
//                     <Chip
//                         label={status}
//                         sx={{
//                             backgroundColor: styles.backgroundColor,
//                             color: styles.color,
//                             '& .MuiChip-label': {
//                                 px: 1
//                             }
//                         }}
//                         size="small"
//                         variant="filled"
//                     />
//                 );
//             }
//         },
//         // ] : []),

//         {
//             field: "Title",
//             headerName: "المهمة",
//             flex: 1,
//             renderCell: (params: any) => {
//                 return params.value || "-";
//             },
//         },
//         {
//             field: "ConcernedEntity",
//             headerName: "الجهة المسؤولة",
//             flex: .7,
//             renderCell: (params: any) => {
//                 return params.value || "-";
//             },
//         },
//         {
//             field: "TaskType",
//             headerName: "نوع النشاط",
//             flex: .7,
//             renderCell: (params: any) => {
//                 return params.value?.Title || "-";
//             },
//         },
//         {
//             field: "Priority",
//             headerName: "الأولوية",
//             flex: .5,
//             renderCell: (params: any) => {
//                 const priority = params.value;
//                 const styles = getPriorityColor(priority);

//                 return (
//                     <Chip
//                         label={priority}
//                         sx={{
//                             backgroundColor: styles.backgroundColor,
//                             color: styles.color,
//                             '& .MuiChip-label': {
//                                 px: 1
//                             }
//                         }}
//                         size="small"
//                         variant="filled"
//                     />
//                 );
//             }
//         },
//         {
//             field: "DueDate",
//             headerName: "موعد التسليم",
//             type: "date",
//             flex: .5,
//             valueGetter: (value: any) => new Date(value),
//             renderCell: (params: any) => {
//                 if (!params.value) return "";
//                 const date = typeof params.value === 'string' ? new Date(params.value) : params.value;
//                 return date.toLocaleDateString('ar-GB');
//             },
//         },
//     ];

//     // if (showActions) {
//     baseColumns.push({
//         field: 'actions',
//         headerName: '',
//         flex: 0.3,
//         sortable: false,
//         filterable: false,
//         renderCell: (params: any) => (
//             <TaskActionMenu
//                 task={params.row}
//                 onEdit={handleEditClick}
//                 onDelete={handleDeleteClick}
//             />
//         ),
//     });
//     // }

//     if (LogType === "employee") {
//         return baseColumns.filter(column => column.field !== "Employee");
//     }

//     return baseColumns;
// }





