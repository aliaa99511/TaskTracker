import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    MenuItem,
    Select,
    Typography,
    TextField
} from "@mui/material";
import { useFetchAllTaskTypeQuery } from "../../../../../store";
import { GetStatusOptions } from "../../../../../configuration/options_field/tasks_status";
import { GetPriorityOptions } from "../../../../../configuration/options_field/tasks_priority";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

const years = [2024, 2025, 2026, 2027, 2028];
const days = Array.from({ length: 31 }, (_, i) => i + 1);

interface Props {
    open: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    onClear: () => void;
    initialFilters: any;
    includeEmployeeFilter?: boolean; // Add this prop
    employees?: Array<{ Id: number; Title: string }>; // Add employees data prop
}

const TasksFilterDialog: React.FC<Props> = ({
    open,
    onClose,
    onApply,
    onClear,
    initialFilters,
    includeEmployeeFilter = false, // Default to false
    employees = [] // Default to empty array
}) => {
    const { data: taskTypes = [] } = useFetchAllTaskTypeQuery();

    // Initialize with provided filters
    const [filters, setFilters] = useState<any>(initialFilters);

    // Update local state when initialFilters prop changes
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const defaultFilters = {
        year: '',
        month: '',
        day: '',
        status: "",
        priority: "",
        concernedEntity: "",
        type: "",
        employee: "" // Add employee to default filters
    };

    const handleChange = (field: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleClear = () => {
        setFilters(defaultFilters);
        onApply(defaultFilters);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                تصفية
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>

                    {/* Year */}
                    <Grid item xs={4}>
                        <Typography>السنة</Typography>
                        <Select
                            fullWidth
                            value={filters.year}
                            onChange={(e) => handleChange("year", e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) return "اختر السنة";
                                return selected;
                            }}
                            sx={{ color: 'text.secondary', mt: .6 }}
                        >
                            {years.map(y => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* Month */}
                    <Grid item xs={4}>
                        <Typography>الشهر</Typography>
                        <Select
                            fullWidth
                            value={filters.month}
                            onChange={(e) => handleChange("month", e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) return "اختر الشهر";
                                return selected;
                            }}
                            sx={{ color: 'text.secondary', mt: .6 }}
                        >
                            {months.map(m => (
                                <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* Day */}
                    <Grid item xs={4}>
                        <Typography>اليوم</Typography>
                        <Select
                            fullWidth
                            value={filters.day}
                            onChange={(e) => handleChange("day", e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) return "اختر اليوم";
                                return selected;
                            }}
                            sx={{ color: 'text.secondary', mt: .6 }}
                        >
                            {days.map(d => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* Status */}
                    <Grid item xs={12}>
                        <Typography>الحالة</Typography>
                        <Select
                            fullWidth
                            value={filters.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) return "اختر الحالة";
                                return selected;
                            }}
                            sx={{ color: 'text.secondary', mt: .6 }}
                        >
                            {GetStatusOptions().map(s => (
                                <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* Priority */}
                    <Grid item xs={12}>
                        <Typography>الأولوية</Typography>
                        <Select
                            fullWidth
                            value={filters.priority}
                            onChange={(e) => handleChange("priority", e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) return "اختر الأولوية";
                                return selected;
                            }}
                            sx={{ color: 'text.secondary', mt: .6 }}
                        >
                            {GetPriorityOptions().map(p => (
                                <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* Task Type From API */}
                    <Grid item xs={12}>
                        <Typography>نوع المهمة</Typography>
                        <Select
                            fullWidth
                            value={filters.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) return "اختر نوع المهمة";
                                return selected;
                            }}
                            sx={{ color: 'text.secondary', mt: .6 }}
                        >
                            {taskTypes.map((t: any) => (
                                <MenuItem key={t.Id} value={t.Title}>
                                    {t.Title}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* ConcernedEntity */}
                    <Grid item xs={12}>
                        <Typography>الجهة المسؤولة</Typography>
                        <TextField
                            fullWidth
                            value={filters.concernedEntity}
                            onChange={(e) =>
                                handleChange("concernedEntity", e.target.value)
                            }
                            placeholder="اكتب الجهة المسؤولة"
                            sx={{ color: 'text.secondary', mt: .6 }}
                        />
                    </Grid>

                    {/* Employee Filter (Conditional) */}
                    {includeEmployeeFilter && employees.length > 0 && (
                        <Grid item xs={12}>
                            <Typography>الموظف</Typography>
                            <Select
                                fullWidth
                                value={filters.employee}
                                onChange={(e) => handleChange("employee", e.target.value)}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) return "اختر الموظف";
                                    return selected;
                                }}
                                sx={{ color: 'text.secondary', mt: .6 }}
                            >
                                <MenuItem value="">الكل</MenuItem>
                                {employees.map((emp: any) => (
                                    <MenuItem key={emp.Id} value={emp.Title}>
                                        {emp.Title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    )}

                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, mt: 3 }}>
                <Button onClick={handleClear} color="error">
                    مسح الكل
                </Button>

                <Button
                    variant="contained"
                    onClick={() => onApply(filters)}
                    sx={{ mr: 1 }}
                >
                    تطبيق
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default TasksFilterDialog;
