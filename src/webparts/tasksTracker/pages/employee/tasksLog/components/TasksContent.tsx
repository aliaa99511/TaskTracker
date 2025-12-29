// import React from "react";
// import { dataGridStyles } from "../../../../../../assets/styles/TableStyles/dataGridStyles.";
// import CustomDataGrid from "../../../../../../common/table";
// import TaskCardsView from "../../components/cardsView/TaskCardsView";

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