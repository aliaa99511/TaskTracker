import React, { useState, useCallback } from 'react';
import {
    useCreateTaskMutation,
    useDeleteAttachmentMutation,
    useDeleteTaskMutation,
    useFetchEmployeeIdQuery,
    useFetchTasksRequestsByEmployeeIdWithCurrentMonthQuery,
    useUpdateTaskMutation,
    useUploadTaskAttachmentMutation
} from '../../../../../store';
import { Box, Typography, Button } from '@mui/material';
import CustomDataGrid from '../../../../../common/table';
import TaskFormDialog from '../../../../../common/components/TaskFormDialog';
import DeleteConfirmationDialog from '../../../../../common/components/DeleteConfirmationDialog';
import { useTaskOperations } from '../components/hooks/useTaskOperations';
import { getEmployeeColumns } from '../../../../../common/components/CommonColumns';
import { dataGridStyles } from '../../../../../assets/styles/TableStyles/dataGridStyles.';
import TaskStatistics from '../components/statistics/TaskStatistics';
import TaskCardsView from '../../components/cardsView/TaskCardsView';
import ToggleButtonView from '../../../../../common/components/ToggleButtonView';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TasksFilterDialog from '../../components/taskFilter/TasksFilterDialog';
import TuneIcon from '@mui/icons-material/Tune';
import { useTasksFilter } from '../../components/taskFilter/hooks/useTasksFilter';

const EmployeeTasksLog: React.FC = () => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: tasks = [], refetch, isLoading } = useFetchTasksRequestsByEmployeeIdWithCurrentMonthQuery(employeeId as number, {
        skip: !employeeId,
    });

    const [openFilter, setOpenFilter] = useState(false);
    const [view, setView] = useState<'table' | 'cards'>('table');
    const [activeCommentRowId, setActiveCommentRowId] = useState<number | null>(null);
    const [commentAnchorEl, setCommentAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Use the tasks filter hook
    const {
        filteredTasks,
        filterState,
        handleFilterChange,
        resetFilters,
        clearFilters,
        isFilterActive
    } = useTasksFilter({
        initialTasks: tasks,
        onFilterChange: useCallback((filtered) => {
            // Optional: Additional logic when filters change
        }, [])
    });

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

    // Handle click outside to close comment box
    const handleGridClick = useCallback(() => {
        setActiveCommentRowId(null);
        setCommentAnchorEl(null);
    }, []);

    const columns = getEmployeeColumns(
        taskOperations.handleEditClick,
        taskOperations.handleDeleteClick,
        activeCommentRowId,
        setActiveCommentRowId
    );

    const handleApplyFilters = useCallback((filters: any) => {
        Object.keys(filters).forEach(key => {
            handleFilterChange(key as keyof typeof filterState, filters[key]);
        });
        setOpenFilter(false);
    }, [handleFilterChange, filterState]);

    const handleClearFilters = useCallback(() => {
        clearFilters();
        setOpenFilter(false);
    }, [clearFilters]);

    const TaskCardsViewMemo = React.memo(TaskCardsView);
    const TaskStatisticsMemo = React.memo(TaskStatistics);

    return (
        <Box sx={{ p: 3 }}>
            {/* Statistics */}
            <TaskStatisticsMemo />

            <Box sx={{ background: "#fff", p: 3, borderRadius: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box>
                        <Typography variant="h5">سجل المهام</Typography>
                        <Typography fontSize={14} color="text.secondary">
                            {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                        {isFilterActive && (
                            <Typography fontSize={12} color="primary">
                                ({filteredTasks.length} من {tasks.length} مهمة بعد التصفية)
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            startIcon={<TuneIcon sx={{ ml: 1.5, mr: -1 }} />}
                            onClick={() => setOpenFilter(true)}
                            sx={{
                                border: "1px solid #c5c5c5",
                                color: isFilterActive ? 'primary.main' : 'inherit'
                            }}
                        >
                            تصفية {isFilterActive && '•'}
                        </Button>
                        {isFilterActive && (
                            <Button
                                onClick={resetFilters}
                                sx={{ color: 'error.main' }}
                            >
                                إلغاء التصفية
                            </Button>
                        )}
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
                            rows={filteredTasks}
                            columns={columns}
                            isLoading={isLoading}
                            getRowHeight={() => 'auto'}
                            sx={{
                                ...dataGridStyles,
                                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                                    outline: 'none',
                                },
                            }}
                            hideQuickFilter
                        />
                    </Box>
                ) : (
                    <TaskCardsViewMemo
                        tasks={filteredTasks}
                        onEdit={taskOperations.handleEditClick}
                        onDelete={taskOperations.handleDeleteClick}
                        activeCommentRowId={activeCommentRowId}
                        setActiveCommentRowId={setActiveCommentRowId}
                        commentAnchorEl={commentAnchorEl}
                        setCommentAnchorEl={setCommentAnchorEl}
                    />
                )}
            </Box>

            <TasksFilterDialog
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                initialFilters={filterState}
            />

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

export default EmployeeTasksLog;