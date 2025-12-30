import React from "react";
import { Box, Typography, Grid, Card } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import {
    useFetchDepartmentsQuery,
    useFetchTasksRequestsQuery,
} from "../../../../../store";

const STATUS_RUNNING = "جاري التنفيذ";
const STATUS_DONE = "تم الانتهاء";
const STATUS_NOT_SOLVED = "لم يتم الحل";

const COLORS = [
    "#FF6B6B", "#FFA500", "#4CAF50", "#8E44AD",
    "#3498DB", "#2ECC71", "#E67E22", "#1ABC9C",
];

// Define the type for status cards
interface StatusCard {
    key: 'total' | typeof STATUS_DONE | typeof STATUS_RUNNING | typeof STATUS_NOT_SOLVED;
    label: string;
    icon: JSX.Element;
    color: string;
    bg: string;
    isTotal?: boolean;
}

const STATUS_CARDS: StatusCard[] = [
    {
        key: 'total',
        label: 'جميع المهام',
        icon: <TrackChangesIcon />,
        color: '#AD94E4',
        bg: '#F0EBFF',
        isTotal: true,
    },
    {
        key: STATUS_DONE,
        label: 'المهام المكتملة',
        icon: <CheckCircleOutlineIcon />,
        color: '#7DCEA0',
        bg: '#E4FFF0',
    },
    {
        key: STATUS_RUNNING,
        label: 'قيد التنفيذ',
        icon: <AccessTimeIcon />,
        color: '#83A5FE',
        bg: '#EEF2FE',
    },
    {
        key: STATUS_NOT_SOLVED,
        label: 'مهام لم يتم حلها',
        icon: <ErrorOutlineIcon />,
        color: '#F1948A',
        bg: '#FFEBE9',
    },
];

const ManagerTaskStatistics = () => {
    const { data: tasks = [] } = useFetchTasksRequestsQuery();
    const { data: allDepartments = [] } = useFetchDepartmentsQuery();

    // if (tasksLoading || allDepLoading) return <Typography>Loading...</Typography>;

    // ===== Global Status Statistics =====
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.Status === STATUS_DONE).length;
    const runningTasks = tasks.filter(t => t.Status === STATUS_RUNNING).length;
    const notSolvedTasks = tasks.filter(t => t.Status === STATUS_NOT_SOLVED).length;

    // ===== Build Chart Data =====
    // Option 1: Use all departments and count from tasks
    const runningByDepartmentMap: Record<string, number> = {};

    tasks.forEach(task => {
        if (task.Status === STATUS_RUNNING && task.Department?.Title) {
            const dep = task.Department.Title;
            runningByDepartmentMap[dep] = (runningByDepartmentMap[dep] || 0) + 1;
        }
    });

    // Build chart data from all departments
    const runningDepartmentData = allDepartments.map((dep, index) => ({
        name: dep.Title,
        value: runningByDepartmentMap[dep.Title] || 0,
        color: COLORS[index % COLORS.length],
    }));

    // Prepare status values for cards
    const statusValues = {
        'total': totalTasks,
        [STATUS_DONE]: completedTasks,
        [STATUS_RUNNING]: runningTasks,
        [STATUS_NOT_SOLVED]: notSolvedTasks,
    };

    return (
        <Box mb={3}>
            <Grid container spacing={2}>

                {/* ---- Donut Chart ---- */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        padding: 2,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '98%'
                    }}>
                        <Typography mb={2} fontWeight="bold">
                            المهام قيد التنفيذ (حسب الإدارات)
                        </Typography>

                        <Box display="flex" alignItems="center" flex={1}>
                            <Box width="40%" pl={2} height="100%" overflow="auto">
                                {runningDepartmentData.map((item, index) => (
                                    <Box key={index} display="flex" alignItems="center" mb={1}>
                                        <Box
                                            width={8}
                                            height={8}
                                            borderRadius="50%"
                                            ml={.7}
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <Typography fontSize={14}>
                                            {item.name} : {item.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box width="60%" height="100%">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={runningDepartmentData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={90}
                                        >
                                            {runningDepartmentData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* ---- Status Cards ---- */}
                <Grid item xs={12} md={6}>
                    <Grid container sx={{ height: '100%' }} spacing={1}>
                        {STATUS_CARDS.map(stat => {
                            const value = stat.isTotal
                                ? totalTasks
                                : statusValues[stat.key];

                            return (
                                <Grid item xs={6} key={stat.label} sx={{ height: '50%' }}>
                                    <Card sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        <Typography fontSize={14} color="text.secondary" mb={1}>
                                            {stat.label}
                                        </Typography>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1.5}>
                                            <Typography fontSize={26} fontWeight={600}>
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
                    </Grid>
                </Grid>

            </Grid>
        </Box>
    );
};

export default ManagerTaskStatistics;
