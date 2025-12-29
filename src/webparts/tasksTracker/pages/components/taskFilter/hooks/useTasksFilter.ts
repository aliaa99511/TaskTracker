import { useState, useMemo } from 'react';

export interface TaskFilterState {
    year: string | number;
    month: string;
    day: string | number;
    status: string;
    priority: string;
    concernedEntity: string;
    type: string;
    employee: string; // Add employee filter
    employeeId?: number; // Optional employee ID for exact matching
}

export interface Task {
    Status: string;
    Priority: string;
    TaskType?: { Title: string };
    ConcernedEntity: string;
    Created: string;
    Employee?: {
        Title: string;
        Id?: number;
    };
    EmployeeId?: number;
}

interface UseTasksFilterProps {
    initialTasks: Task[];
    onFilterChange?: (filteredTasks: Task[]) => void;
    includeEmployeeFilter?: boolean; // Add flag to conditionally include employee filter
}

interface UseTasksFilterReturn {
    filteredTasks: Task[];
    filterState: TaskFilterState;
    handleFilterChange: (field: keyof TaskFilterState, value: any) => void;
    applyFilters: () => void;
    resetFilters: () => void;
    clearFilters: () => void;
    isFilterActive: boolean;
}

const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const initialFilterState: TaskFilterState = {
    year: '',
    month: '',
    day: '',
    status: '',
    priority: '',
    concernedEntity: '',
    type: '',
    employee: ''
};

// Move helper function outside the hook to avoid hoisting issues
const hasActiveFilters = (filters: TaskFilterState): boolean => {
    return Object.values(filters).some(value =>
        value !== '' && value !== null && value !== undefined
    );
};

export const useTasksFilter = ({
    initialTasks,
    onFilterChange,
    includeEmployeeFilter = false // Default to false for backward compatibility
}: UseTasksFilterProps): UseTasksFilterReturn => {
    const [filterState, setFilterState] = useState<TaskFilterState>(initialFilterState);

    // Calculate isFilterActive directly from filterState without useState
    const isFilterActive = useMemo(() => hasActiveFilters(filterState), [filterState]);

    // Memoize filtered tasks
    const filteredTasks = useMemo(() => {
        let result = [...initialTasks];

        // Apply status filter
        if (filterState.status) {
            result = result.filter(t => t.Status === filterState.status);
        }

        // Apply priority filter
        if (filterState.priority) {
            result = result.filter(t => t.Priority === filterState.priority);
        }

        // Apply type filter
        if (filterState.type) {
            result = result.filter(t => t.TaskType?.Title === filterState.type);
        }

        // Apply concerned entity filter (partial match)
        if (filterState.concernedEntity) {
            result = result.filter(t =>
                (t.ConcernedEntity || "").toLowerCase()
                    .includes(filterState.concernedEntity.toLowerCase())
            );
        }

        // Apply employee filter (only if includeEmployeeFilter is true)
        if (includeEmployeeFilter && filterState.employee) {
            result = result.filter(t => {
                // Check if employee data exists
                if (t.Employee?.Title) {
                    return t.Employee.Title.toLowerCase()
                        .includes(filterState.employee.toLowerCase());
                }
                return false;
            });
        }

        // Apply date filters
        if (filterState.year || filterState.month || filterState.day) {
            result = result.filter(t => {
                try {
                    const date = new Date(t.Created);
                    const taskYear = date.getFullYear();
                    const taskMonth = months[date.getMonth()];
                    const taskDay = date.getDate();

                    const matchesYear = !filterState.year || taskYear === Number(filterState.year);
                    const matchesMonth = !filterState.month || taskMonth === filterState.month;
                    const matchesDay = !filterState.day || taskDay === Number(filterState.day);

                    return matchesYear && matchesMonth && matchesDay;
                } catch (error) {
                    console.error('Error parsing task date:', error);
                    return false;
                }
            });
        }

        if (onFilterChange) {
            onFilterChange(result);
        }

        return result;
    }, [initialTasks, filterState, onFilterChange, includeEmployeeFilter]);

    const handleFilterChange = (field: keyof TaskFilterState, value: any) => {
        setFilterState(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetFilters = () => {
        setFilterState(initialFilterState);
    };

    const clearFilters = () => {
        setFilterState(initialFilterState);
    };

    return {
        filteredTasks,
        filterState,
        handleFilterChange,
        applyFilters: () => { },
        resetFilters,
        clearFilters,
        isFilterActive
    };
};

// Helper hook for date-related filter options
export const useDateFilterOptions = () => {
    const years = [2024, 2025, 2026, 2027, 2028];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return {
        months,
        years,
        days
    };
};

// Utility function to get default filter state based on current date
export const getDefaultFilterState = (): TaskFilterState => {
    const today = new Date();
    return {
        ...initialFilterState,
        year: today.getFullYear(),
        month: months[today.getMonth()],
        day: today.getDate()
    };
};