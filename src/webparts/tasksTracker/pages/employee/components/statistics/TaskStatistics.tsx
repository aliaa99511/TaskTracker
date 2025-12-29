import * as React from 'react';
import { Grid, Card, Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFetchEmployeeIdQuery, useFetchTasksRequestsByEmployeeIdQuery } from '../../../../../../store';
import { safePercent } from '../../../../../../utils/helpers';

const COLORS = {
    completed: '#7DCEA0',
    pending: '#83A5FE',
    rejected: '#F1948A',
};

const STATS = [
    {
        key: 'total',
        label: 'مهامي',
        icon: <TrackChangesIcon />,
        color: '#AD94E4',
        bg: '#F0EBFF',
        isTotal: true,
    },
    {
        key: 'تم الانتهاء',
        label: 'مهام مكتملة',
        icon: <CheckCircleOutlineIcon />,
        color: COLORS.completed,
        bg: '#E4FFF0',
    },
    {
        key: 'جاري التنفيذ',
        label: 'قيد التنفيذ',
        icon: <AccessTimeIcon />,
        color: COLORS.pending,
        bg: '#EEF2FE',
    },
    {
        key: 'لم يتم الحل',
        label: 'مهام لم يتم حلها',
        icon: <ErrorOutlineIcon />,
        color: COLORS.rejected,
        bg: '#FFEBE9',
    },
];

const TaskStatistics = () => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: tasks = [], } =
        useFetchTasksRequestsByEmployeeIdQuery(employeeId as number, {
            skip: !employeeId,
        });

    const completed = tasks.filter((t: any) => t.Status === 'تم الانتهاء').length;
    const pending = tasks.filter((t: any) => t.Status === 'جاري التنفيذ').length;
    const rejected = tasks.filter((t: any) => t.Status === 'لم يتم الحل').length;

    const total = tasks.length || 0;

    const chartData = [
        { name: 'مكتمل', value: completed, color: COLORS.completed },
        { name: 'قيد التنفيذ', value: pending, color: COLORS.pending },
        { name: 'لم يتم الحل', value: rejected, color: COLORS.rejected },
    ];

    return (
        <Grid container spacing={1.5} mb={3} alignItems="stretch">
            {STATS.map(stat => {
                const value = stat.isTotal
                    ? total
                    : tasks.filter((t: any) => t.Status === stat.key).length;

                return (
                    <Grid item xs={12} md={2.2} key={stat.label}>
                        <Card sx={{ p: 1.5, borderRadius: 3, height: '100%', pt: 2 }}>
                            <Typography fontSize={16} color="text.secondary">
                                {stat.label}
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent={"space-between"} gap={1.5} sx={{ margin: "10px 10px 2px 10px" }}>
                                <Typography fontSize={29} fontWeight={600}>
                                    {value}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: '50%',
                                        backgroundColor: stat.bg,
                                        color: stat.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                );
            })}

            {/* Donut Chart */}
            <Grid item xs={12} md={3.2}>
                <Card sx={{ p: 1.5, borderRadius: 3, height: "100%" }}>

                    {total === 0 ? (
                        <Box
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <LegendItem color={COLORS.completed} label="مكتمل" value={0} total={0} />
                            <LegendItem color={COLORS.pending} label="قيد التنفيذ" value={0} total={0} />
                            <LegendItem color={COLORS.rejected} label="لم يتم الحل" value={0} total={0} />
                        </Box>
                    ) : (
                        <Grid container alignItems="center" height="100%">
                            <Grid item xs={6} display="flex" justifyContent="center" alignItems="center">
                                <Box width="100%" height={110}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={38}
                                                outerRadius={53}
                                                stroke="none"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <LegendItem color={COLORS.completed} label="مكتمل" value={completed} total={total} />
                                <LegendItem color={COLORS.pending} label="قيد التنفيذ" value={pending} total={total} />
                                <LegendItem color={COLORS.rejected} label="لم يتم الحل" value={rejected} total={total} />
                            </Grid>
                        </Grid>
                    )}
                </Card>
            </Grid>
        </Grid>
    );
};

const LegendItem = ({ color, label, value, total }: any) => (
    <Grid container alignItems="center" fontSize={13} mb={0.5}>
        <Grid item xs={1}></Grid>

        <Grid item xs={8.5}>
            <Box display="flex" alignItems="center" gap={1}>
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: color,
                    }}
                />
                <Typography fontSize={13}>{label}</Typography>
            </Box>
        </Grid>

        <Grid item xs={2.5}>
            <Typography fontSize={13} textAlign="right">
                {safePercent(value, total)}%
            </Typography>
        </Grid>
    </Grid>
);

export default TaskStatistics;
