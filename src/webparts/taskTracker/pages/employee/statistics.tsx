import * as React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useFetchEmployeeIdQuery, useFetchPendingTasksRequestsByEmployeeIdQuery } from '../../../../store';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TasksStatistics: React.FC = () => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: tasks, isLoading } = useFetchPendingTasksRequestsByEmployeeIdQuery(employeeId as number);

    if (isLoading || !tasks) return null;

    // Calculate statistics
    const stats = {
        total: tasks.length,
        pending: tasks.filter((t: any) => t.Status === 'لم يبدأ بعد' || t.Status === 'جاري التنفيذ').length,
        inProgress: tasks.filter((t: any) => t.Status === 'جاري التنفيذ').length,
        completed: tasks.filter((t: any) => t.Status === 'تم الانتهاء').length,
        reviewed: tasks.filter((t: any) => t.Status === 'جاري المراجعة').length,
        notStarted: tasks.filter((t: any) => t.Status === 'لم يبدأ بعد').length,
        urgent: tasks.filter((t: any) => t.Priority === 'حرجة').length,
        high: tasks.filter((t: any) => t.Priority === 'عالية').length,
        medium: tasks.filter((t: any) => t.Priority === 'متوسطة').length,
    };

    // Data for pie chart
    const statusData = [
        { name: 'لم يبدأ بعد', value: stats.notStarted, color: '#ff6b6b' },
        { name: 'جاري التنفيذ', value: stats.inProgress, color: '#4dabf7' },
        { name: 'تم الانتهاء', value: stats.completed, color: '#51cf66' },
        { name: 'جاري المراجعة', value: stats.reviewed, color: '#ffd43b' },
    ];

    const priorityData = [
        { name: 'حرجة', value: stats.urgent, color: '#fa5252' },
        { name: 'عالية', value: stats.high, color: '#ff922b' },
        { name: 'متوسطة', value: stats.medium, color: '#339af0' },
    ];

    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
                إحصائيات المهام
            </Typography>

            <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                        <Typography color="textSecondary">إجمالي المهام</Typography>
                        <Typography variant="h4">{stats.total}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#fff3cd' }}>
                        <Typography color="textSecondary">قيد التنفيذ</Typography>
                        <Typography variant="h4">{stats.inProgress}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#d1e7dd' }}>
                        <Typography color="textSecondary">مكتملة</Typography>
                        <Typography variant="h4">{stats.completed}</Typography>
                    </Paper>
                </Grid>

                {/* Status Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>حالة المهام</Typography>
                    <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>

                {/* Priority Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>أولوية المهام</Typography>
                    <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default TasksStatistics;