import React from 'react'
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
import ManagerTaskStatistics from '../../manager/statistics/ManagerTaskStatistics';

const ManagerTasksLog = () => {
    const { data: tasks = [], isLoading } = useFetchCurrentMonthTasksRequestsQuery();

    console.log('Current Month Tasks', tasks);
    const [view, setView] = React.useState<'table' | 'cards'>('table');
    const [openFilter, setOpenFilter] = React.useState(false);

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
        includeEmployeeFilter: true, // Enable employee filter for manager view
        onFilterChange: React.useCallback((filtered) => {
            // Optional: Additional logic when filters change
        }, [])
    });

    const handleApplyFilters = React.useCallback((filters: any) => {
        // Update filter state from dialog
        Object.keys(filters).forEach(key => {
            handleFilterChange(key as keyof typeof filterState, filters[key]);
        });
        setOpenFilter(false);
    }, [handleFilterChange]);

    const handleClearFilters = React.useCallback(() => {
        clearFilters();
        setOpenFilter(false);
    }, [clearFilters]);

    const columns = getManagerColumns(
        undefined,
        undefined
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
                    <CustomDataGrid
                        rows={filteredTasks} // Use filteredTasks instead of tasks
                        columns={columns}
                        isLoading={isLoading}
                        getRowHeight={() => 'auto'}
                        sx={dataGridStyles}
                        hideQuickFilter
                    />
                ) : (
                    <TaskCardsView
                        tasks={filteredTasks} // Use filteredTasks instead of tasks
                    />
                )}

                <TasksFilterDialog
                    open={openFilter}
                    onClose={() => setOpenFilter(false)}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                    initialFilters={filterState}
                    includeEmployeeFilter={true} // Enable employee filter in dialog
                    employees={employees} // Pass employees data
                />
            </Box>
        </Box>
    )
}

export default ManagerTasksLog;
