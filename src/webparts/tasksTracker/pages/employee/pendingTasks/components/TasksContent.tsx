// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import TaskListEmptyState from './TaskListEmptyState';
// import CustomDataGrid from '../../../../../../common/table';
// import { dataGridStyles } from '../../../../../../assets/styles/TableStyles/dataGridStyles.';
// import TaskCardsView from '../../components/cardsView/TaskCardsView';

// interface TasksContentProps {
//     view: 'table' | 'cards';
//     filteredTasks: any[];
//     columns: any[];
//     isLoading: boolean;
//     onEdit: (task: any) => void; // Accepts single task object
//     onDelete: (task: any) => void; // Accepts single task object
// }

// const TasksContent: React.FC<TasksContentProps> = ({
//     view,
//     filteredTasks,
//     columns,
//     isLoading,
//     onEdit,
//     onDelete
// }) => {
//     if (isLoading) {
//         return (
//             <Box sx={{ py: 8, textAlign: 'center' }}>
//                 <Typography color="text.secondary">
//                     جاري تحميل المهام...
//                 </Typography>
//             </Box>
//         );
//     }

//     if (filteredTasks.length === 0) {
//         return <TaskListEmptyState />;
//     }

//     if (view === 'table') {
//         return (
//             <CustomDataGrid
//                 rows={filteredTasks}
//                 columns={columns}
//                 isLoading={isLoading}
//                 getRowHeight={() => 'auto'}
//                 sx={dataGridStyles}
//                 hideQuickFilter
//             />
//         );
//     }

//     return (
//         <TaskCardsView
//             tasks={filteredTasks}
//             onEdit={onEdit}
//             onDelete={onDelete}
//         />
//     );
// };

// export default TasksContent;