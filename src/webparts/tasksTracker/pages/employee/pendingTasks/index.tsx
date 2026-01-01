import React, { useState, useCallback } from 'react';
import {
    useCreateTaskMutation,
    useDeleteAttachmentMutation,
    useDeleteTaskMutation,
    useFetchEmployeeByIdQuery,
    useFetchEmployeeIdQuery,
    useFetchPendingTasksRequestsByEmployeeIdQuery,
    useUpdateTaskMutation,
    useUploadTaskAttachmentMutation
} from '../../../../../store';
import { Box, Typography, Button } from '@mui/material';
import CustomDataGrid from '../../../../../common/table';
import TaskFormDialog from '../../components/TaskForm';
import DeleteConfirmationDialog from '../../../../../common/components/DeleteConfirmationDialog';
import { useTaskOperations } from '../components/hooks/useTaskOperations';
import { getEmployeeColumns } from '../../components/tableColumns';
import { dataGridStyles } from '../../../../../assets/styles/TableStyles/dataGridStyles.';
import TaskStatistics from '../components/statistics/TaskStatistics';
import TaskCardsView from '../../components/taskCardsView';
import ToggleButtonView from '../../../../../common/components/ToggleButtonView';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TaskDetailsDialog from '../../components/taskdetails';

const EmployeePendingTasksLog: React.FC = () => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: tasks = [], refetch, isLoading } =
        useFetchPendingTasksRequestsByEmployeeIdQuery(employeeId as number, {
            skip: !employeeId,
        });
    const { data: employeeData } = useFetchEmployeeByIdQuery(employeeId as number, {
        skip: !employeeId,
    });

    // Extract department ID from employee data
    const employeeDepartmentId = employeeData?.DepartmentId;

    const [view, setView] = useState<'table' | 'cards'>('table');
    const [activeCommentRowId, setActiveCommentRowId] = useState<number | null>(null);
    const [commentAnchorEl, setCommentAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

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
        deleteAttachment,
        employeeDepartmentId // Pass department ID here
    );

    // Handle click outside to close comment box
    const handleGridClick = useCallback(() => {
        setActiveCommentRowId(null);
        setCommentAnchorEl(null);
    }, []);

    // Handle row click in data grid
    const handleRowClick = useCallback((params: any) => {
        setSelectedTask(params.row);
        setDetailsModalOpen(true);
    }, []);

    // Handle card click in cards view
    const handleCardClick = useCallback((task: any) => {
        setSelectedTask(task);
        setDetailsModalOpen(true);
    }, []);

    // Close details modal
    const handleCloseDetailsModal = useCallback(() => {
        setDetailsModalOpen(false);
        setSelectedTask(null);
    }, []);

    const columns = getEmployeeColumns(
        taskOperations.handleEditClick,
        taskOperations.handleDeleteClick,
        activeCommentRowId,
        setActiveCommentRowId
    );

    return (
        <Box sx={{ p: 1.3 }}>
            {/* Statistics */}
            <TaskStatistics />

            <Box sx={{ background: "#fff", p: 2, borderRadius: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between">
                    <Box>
                        <Typography variant="h5">المهام المعلقة</Typography>
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
                    <Box onClick={handleGridClick}>
                        <CustomDataGrid
                            rows={tasks}
                            columns={columns}
                            isLoading={isLoading}
                            getRowHeight={() => 'auto'}
                            onRowClick={handleRowClick}
                            sx={{
                                ...dataGridStyles,
                                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                            hideQuickFilter
                        />
                    </Box>
                ) : (
                    <TaskCardsView
                        tasks={tasks}
                        onEdit={taskOperations.handleEditClick}
                        onDelete={taskOperations.handleDeleteClick}
                        activeCommentRowId={activeCommentRowId}
                        setActiveCommentRowId={setActiveCommentRowId}
                        commentAnchorEl={commentAnchorEl}
                        setCommentAnchorEl={setCommentAnchorEl}
                        onCardClick={handleCardClick}
                    />
                )}
            </Box>

            {/* Task Details Modal */}
            <TaskDetailsDialog
                open={detailsModalOpen}
                onClose={handleCloseDetailsModal}
                task={selectedTask}
            />

            <TaskFormDialog
                open={taskOperations.openDialog}
                onClose={() => taskOperations.setOpenDialog(false)}
                onSubmit={taskOperations.handleSubmit}
                initialData={taskOperations.editingTask || undefined}
                isEdit={!!taskOperations.editingTask}
                departmentId={employeeDepartmentId} // Pass department ID here
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

export default EmployeePendingTasksLog;