import React, { useState, useCallback } from 'react'
import { useFetchCurrentMonthTasksRequestsQuery } from '../../../../../store';
import { getManagerColumns } from '../../../../../common/components/CommonColumns';
import { Box, Button, Typography } from '@mui/material';
import CustomDataGrid from '../../../../../common/table';
import { dataGridStyles } from '../../../../../assets/styles/TableStyles/dataGridStyles.';
import TaskCardsView from '../../components/cardsView/TaskCardsView';
import ToggleButtonView from '../../../../../common/components/ToggleButtonView';
import TasksFilterDialog from '../../components/taskFilter/TasksFilterDialog';
import { useTasksFilter } from '../../components/taskFilter/hooks/useTasksFilter';
import TuneIcon from '@mui/icons-material/Tune';
import ManagerTaskStatistics from './statistics/ManagerTaskStatistics';

const ManagerTasksLog = () => {
    const { data: tasks = [], isLoading } = useFetchCurrentMonthTasksRequestsQuery();

    const [view, setView] = useState<'table' | 'cards'>('table');
    const [openFilter, setOpenFilter] = useState(false);
    const [activeCommentRowId, setActiveCommentRowId] = useState<number | null>(null);
    const [commentAnchorEl, setCommentAnchorEl] = useState<HTMLButtonElement | null>(null);

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
                    <TaskCardsView
                        tasks={filteredTasks}
                        activeCommentRowId={activeCommentRowId}
                        setActiveCommentRowId={setActiveCommentRowId}
                        commentAnchorEl={commentAnchorEl}
                        setCommentAnchorEl={setCommentAnchorEl}
                    />
                )}

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
        </Box>
    )
}

export default ManagerTasksLog;