import React, { useState, useCallback } from 'react'
import { useFetchCurrentMonthTasksRequestsQuery } from '../../../../../store';
import { Box, Button, Typography } from '@mui/material';
import CustomDataGrid from '../../../../../common/table';
import { dataGridStyles } from '../../../../../assets/styles/TableStyles/dataGridStyles.';
import ToggleButtonView from '../../../../../common/components/ToggleButtonView';
import { useTasksFilter } from '../../components/taskFilter/hooks/useTasksFilter';
import TuneIcon from '@mui/icons-material/Tune';
import ManagerTaskStatistics from '../statistics/ManagerTaskStatistics';
import TaskCardsView from '../../components/taskCardsView';
import TasksFilterDialog from '../../components/taskFilter';
import TaskDetailsDialog from '../../components/taskdetails';
import { getManagerColumns } from '../../components/tableColumns';

const ManagerTasksLog = () => {
    const { data: tasks = [], isLoading } = useFetchCurrentMonthTasksRequestsQuery();

    const [view, setView] = useState<'table' | 'cards'>('table');
    const [openFilter, setOpenFilter] = useState(false);
    const [activeCommentRowId, setActiveCommentRowId] = useState<number | null>(null);
    const [commentAnchorEl, setCommentAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedTask, setSelectedTask] = useState<any>(null); // Add state for selected task
    const [detailsModalOpen, setDetailsModalOpen] = useState(false); // Add state for modal

    // Extract unique employees from tasks data
    const employees = React.useMemo(() => {
        const employeeMap = new Map();
        tasks.forEach(task => {
            if (task.Employee && task.Employee.Id && task.Employee.Title) {
                if (!employeeMap.has(task.Employee.Id)) {
                    employeeMap.set(task.Employee.Id, {
                        Id: task.Employee.Id,
                        Title: task.Employee.Title
                    });
                }
            }
        });
        return Array.from(employeeMap.values());
    }, [tasks]);

    // Use the tasks filter hook with employee filter enabled
    const {
        filteredTasks,
        filterState,
        handleFilterChange,
        resetFilters,
        clearFilters,
        isFilterActive
    } = useTasksFilter({
        initialTasks: tasks,
        includeEmployeeFilter: true,
        onFilterChange: useCallback((filtered) => {
            // Optional: Additional logic when filters change
        }, [])
    });

    // Handle click outside to close comment box
    const handleGridClick = useCallback(() => {
        setActiveCommentRowId(null);
        setCommentAnchorEl(null);
    }, []);

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

    const columns = getManagerColumns(
        undefined,
        undefined,
        activeCommentRowId,
        setActiveCommentRowId
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Statistics */}
            <ManagerTaskStatistics />

            <Box sx={{ background: "#fff", p: 3, borderRadius: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box>
                        <Typography variant="h5">سجل المهام</Typography>
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
                            onRowClick={handleRowClick} // Add this prop
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
                        tasks={filteredTasks}
                        activeCommentRowId={activeCommentRowId}
                        setActiveCommentRowId={setActiveCommentRowId}
                        commentAnchorEl={commentAnchorEl}
                        setCommentAnchorEl={setCommentAnchorEl}
                        onCardClick={handleCardClick} // Pass this prop
                    />
                )}

                {/* Filter Dialog */}
                <TasksFilterDialog
                    open={openFilter}
                    onClose={() => setOpenFilter(false)}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                    initialFilters={filterState}
                    includeEmployeeFilter={true}
                    employees={employees}
                />
            </Box>

            {/* Task Details Modal */}
            <TaskDetailsDialog
                open={detailsModalOpen}
                onClose={handleCloseDetailsModal}
                task={selectedTask}
            />
        </Box>
    )
}

export default ManagerTasksLog;