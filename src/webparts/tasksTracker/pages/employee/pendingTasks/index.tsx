import React from 'react';
import {
    useCreateTaskMutation,
    useDeleteAttachmentMutation,
    useDeleteTaskMutation,
    useFetchEmployeeIdQuery,
    useFetchTasksRequestsByEmployeeIdQuery,
    useUpdateTaskMutation,
    useUploadTaskAttachmentMutation
} from '../../../../../store';
import { Box, Typography, Button } from '@mui/material';
import CustomDataGrid from '../../../../../common/table';
import TaskFormDialog from '../../../../../common/components/TaskFormDialog';
import DeleteConfirmationDialog from '../../../../../common/components/DeleteConfirmationDialog';
import { useTaskOperations } from './components/hooks/useTaskOperations';
import { getEmployeePendingColumns } from '../../../../../common/components/CommonColumns';
import { dataGridStyles } from '../../../../../assets/styles/TableStyles/dataGridStyles.';
import TaskStatistics from './components/statistics/TaskStatistics';
import TaskCardsView from './components/cardsView/TaskCardsView';
import ToggleButtonView from '../../../../../common/components/ToggleButtonView';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const PendingTasksLog: React.FC = () => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: tasks = [], refetch, isLoading } =
        useFetchTasksRequestsByEmployeeIdQuery(employeeId as number, {
            skip: !employeeId,
        });

    const [view, setView] = React.useState<'table' | 'cards'>('table');

    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [uploadAttachment] = useUploadTaskAttachmentMutation();
    const [deleteAttachment] = useDeleteAttachmentMutation();

    const taskOperations = useTaskOperations(
        employeeId,
        refetch,
        createTask,
        updateTask,
        deleteTask,
        uploadAttachment,
        deleteAttachment
    );

    const columns = getEmployeePendingColumns(
        taskOperations.handleEditClick,
        taskOperations.handleDeleteClick
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Statistics */}
            <TaskStatistics />

            <Box sx={{ background: "#fff", p: 3, borderRadius: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box>
                        <Typography variant="h5"> قيد التنفيذ</Typography>
                        <Typography fontSize={14} color="text.secondary">
                            {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            startIcon={<AddCircleOutlineIcon sx={{ ml: 1.5 }} />}
                            onClick={taskOperations.handleCreateClick}
                            sx={{
                                backgroundColor: 'primary.main',
                                color: '#fff',
                                borderRadius: 2,
                                pr: 1.2,
                                pl: 2,
                                '&:hover': { backgroundColor: 'primary.main' }
                            }}
                        >
                            مهمة جديدة
                        </Button>
                        {/* View Switch */}
                        <ToggleButtonView
                            view={view}
                            setView={setView}
                        />
                    </Box>
                </Box>

                {/* Content */}
                {view === 'table' ? (
                    <CustomDataGrid
                        rows={tasks}
                        columns={columns}
                        isLoading={isLoading}
                        getRowHeight={() => 'auto'}
                        sx={dataGridStyles}
                        hideQuickFilter
                    />
                ) : (
                    <TaskCardsView
                        tasks={tasks}
                        onEdit={taskOperations.handleEditClick}
                        onDelete={taskOperations.handleDeleteClick}
                    />
                )}
            </Box>

            <TaskFormDialog
                open={taskOperations.openDialog}
                onClose={() => taskOperations.setOpenDialog(false)}
                onSubmit={taskOperations.handleSubmit}
                initialData={taskOperations.editingTask || undefined}
                isEdit={!!taskOperations.editingTask}
            />

            <DeleteConfirmationDialog
                open={taskOperations.deleteDialogOpen}
                onClose={taskOperations.handleCancelDelete}
                onConfirm={taskOperations.handleConfirmDelete}
                title="تأكيد حذف المهمة"
                itemName={taskOperations.taskToDelete?.title || ''}
                itemType="المهمة"
                isLoading={taskOperations.isDeleting}
            />
        </Box>
    );
};

export default PendingTasksLog;
