import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    Tooltip,
} from "@mui/material";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

import {
    useFetchDepartmentsQuery,
    useFetchTasksRequestsQuery,
} from "../../../../../store";

/* ================= CONSTANTS ================= */

const STATUS_RUNNING = "جاري التنفيذ";
const STATUS_DONE = "تم الانتهاء";
const STATUS_NOT_SOLVED = "لم يتم الحل";

const COLORS = [
    "#8C7BFA",
    "#86D1A4",
    "#F6B26B",
    "#F28B82",
    "#4DD0E1",
    "#BA68C8",
    "#FFD54F",
    "#90CAF9",
];

/* ================= STATUS CARDS ================= */

interface StatusCard {
    key: "total" | typeof STATUS_DONE | typeof STATUS_RUNNING | typeof STATUS_NOT_SOLVED;
    label: string;
    icon: JSX.Element;
    color: string;
    bg: string;
    isTotal?: boolean;
}

const STATUS_CARDS: StatusCard[] = [
    {
        key: "total",
        label: "جميع المهام",
        icon: <TrackChangesIcon />,
        color: "#8E75E3",
        bg: "#F0EBFF",
        isTotal: true,
    },
    {
        key: STATUS_DONE,
        label: "المهام المكتملة",
        icon: <CheckCircleOutlineIcon />,
        color: "#2ECC71",
        bg: "#E9F7EF",
    },
    {
        key: STATUS_RUNNING,
        label: "قيد التنفيذ",
        icon: <AccessTimeIcon />,
        color: "#4D7CFE",
        bg: "#EEF2FE",
    },
    {
        key: STATUS_NOT_SOLVED,
        label: "مهام لم يتم حلها",
        icon: <ErrorOutlineIcon />,
        color: "#E74C3C",
        bg: "#FDEDEC",
    },
];

/* ================= COMPONENT ================= */

const ManagerTaskStatistics = () => {
    const { data: tasks = [] } = useFetchTasksRequestsQuery();
    const { data: allDepartments = [] } = useFetchDepartmentsQuery();

    // State to track the selected department
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    /* ---------- FILTERED TASKS BASED ON SELECTED DEPARTMENT ---------- */
    const filteredTasks = selectedDepartment
        ? tasks.filter(task => task.Department?.Title === selectedDepartment)
        : tasks;

    /* ---------- COUNTS ---------- */
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.Status === STATUS_DONE).length;
    const runningTasks = filteredTasks.filter(t => t.Status === STATUS_RUNNING).length;
    const notSolvedTasks = filteredTasks.filter(t => t.Status === STATUS_NOT_SOLVED).length;

    /* ---------- RUNNING BY DEPARTMENT ---------- */
    const runningByDepartment: Record<string, number> = {};

    tasks.forEach(task => {
        if (task.Status === STATUS_RUNNING && task.Department?.Title) {
            const dep = task.Department.Title;
            runningByDepartment[dep] = (runningByDepartment[dep] || 0) + 1;
        }
    });

    const departmentBars = allDepartments.map((dep, index) => ({
        name: dep.Title,
        value: runningByDepartment[dep.Title] || 0,
        color: COLORS[index % COLORS.length],
    }));

    // Only departments that actually have running tasks
    const validDepartments = departmentBars.filter(dep => dep.value > 0);

    /* ---------- STATUS VALUES ---------- */
    const statusValues = {
        total: totalTasks,
        [STATUS_DONE]: completedTasks,
        [STATUS_RUNNING]: runningTasks,
        [STATUS_NOT_SOLVED]: notSolvedTasks,
    };

    /* ---------- HANDLE DEPARTMENT CLICK ---------- */
    const handleDepartmentClick = (departmentName: string) => {
        if (selectedDepartment === departmentName) {
            // If clicking the same department, reset to show all
            setSelectedDepartment(null);
        } else {
            // Select the clicked department
            setSelectedDepartment(departmentName);
        }
    };

    /* ---------- HANDLE RESET FILTER ---------- */
    const handleResetFilter = () => {
        setSelectedDepartment(null);
    };

    /* ================= RENDER ================= */
    return (
        <Box mb={1.5}>
            <Grid container spacing={1} alignItems="stretch">

                {/* ================= STACKED BAR ================= */}
                <Grid item xs={12} md={4} display="flex">
                    <Card
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography fontWeight="bold" sx={{ textAlign: "right" }}>
                                المهام قيد التنفيذ (حسب الإدارات)
                            </Typography>
                            {selectedDepartment && (
                                <Typography
                                    variant="caption"
                                    color="primary"
                                    sx={{
                                        textAlign: "left",
                                        mr: .3,
                                        cursor: "pointer",
                                        "&:hover": { textDecoration: "underline" }
                                    }}
                                    onClick={handleResetFilter}
                                >
                                    إلغاء التصفية
                                </Typography>
                            )}
                        </Box>

                        <Box flex={1} display="flex" alignItems="center">
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    height: 40,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    backgroundColor: "#F3F4F6",
                                }}
                            >
                                {validDepartments.length === 0 ? (
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#777"
                                        }}
                                    >
                                        لا توجد مهام قيد التنفيذ
                                    </Box>
                                ) : (
                                    validDepartments.map((dep, index) => {
                                        const isSelected = selectedDepartment === dep.name;
                                        return (
                                            <Tooltip title={`${dep.name}: ${dep.value}`} arrow key={index}>
                                                <Box
                                                    onClick={() => handleDepartmentClick(dep.name)}
                                                    sx={{
                                                        flex: dep.value,
                                                        backgroundColor: isSelected ? "#999999ff" : dep.color,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: isSelected ? "#fff" : "#fff",
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        transition: "0.25s",
                                                        position: "relative",
                                                        "&:hover": {
                                                            opacity: 0.9,
                                                            transform: "scale(1.02)",
                                                        },
                                                        ...(isSelected && {
                                                            boxShadow: "0 0 0 2px #2196f3",
                                                            zIndex: 1,
                                                        })
                                                    }}
                                                >
                                                    {dep.value}
                                                    {isSelected && (
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                top: -20,
                                                                right: 0,
                                                                left: 0,
                                                                textAlign: "center",
                                                                fontSize: 10,
                                                                color: "#2196f3",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            ✓
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Tooltip>
                                        );
                                    })
                                )}
                            </Box>
                        </Box>

                        {/* Selected Department Info */}
                        {selectedDepartment && (
                            <Box mt={2} p={1} bgcolor="#f5f5f5" borderRadius={1} sx={{ textAlign: "right" }}>
                                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "right" }}>
                                    معروض: مهام إدارة <strong>{selectedDepartment}</strong>
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </Grid>

                {/* ================= STATUS CARDS ================= */}
                <Grid item xs={12} md={8} display="flex">
                    <Grid container spacing={1} flex={1}>
                        {STATUS_CARDS.map(stat => {
                            const value = stat.isTotal
                                ? totalTasks
                                : statusValues[stat.key];

                            return (
                                <Grid item xs={3} key={stat.label} display="flex">
                                    <Card
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            position: "relative",
                                            ...(selectedDepartment && {
                                                border: "2px solid #2196f3",
                                            })
                                        }}
                                    >
                                        {selectedDepartment && stat.isTotal && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: -8,
                                                    right: -8,
                                                    backgroundColor: "#2196f3",
                                                    color: "white",
                                                    borderRadius: "50%",
                                                    width: 20,
                                                    height: 20,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 10,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ف
                                            </Box>
                                        )}

                                        <Typography
                                            fontSize={14}
                                            color="text.secondary"
                                            mb={1}
                                            textAlign="right"
                                        >
                                            {stat.label}
                                        </Typography>

                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Typography fontSize={26} fontWeight={600}>
                                                {value}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    width: 46,
                                                    height: 46,
                                                    borderRadius: "50%",
                                                    backgroundColor: stat.bg,
                                                    color: stat.color,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
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




// // work
// import React from "react";
// import { Box, Typography, Grid, Card } from "@mui/material";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import TrackChangesIcon from '@mui/icons-material/TrackChanges';
// import {
//     useFetchDepartmentsQuery,
//     useFetchTasksRequestsQuery,
// } from "../../../../../store";

// const STATUS_RUNNING = "جاري التنفيذ";
// const STATUS_DONE = "تم الانتهاء";
// const STATUS_NOT_SOLVED = "لم يتم الحل";

// const COLORS = [
//     "#FF6B6B", "#FFA500", "#4CAF50", "#8E44AD",
//     "#3498DB", "#2ECC71", "#E67E22", "#1ABC9C",
// ];

// // Define the type for status cards
// interface StatusCard {
//     key: 'total' | typeof STATUS_DONE | typeof STATUS_RUNNING | typeof STATUS_NOT_SOLVED;
//     label: string;
//     icon: JSX.Element;
//     color: string;
//     bg: string;
//     isTotal?: boolean;
// }

// const STATUS_CARDS: StatusCard[] = [
//     {
//         key: 'total',
//         label: 'جميع المهام',
//         icon: <TrackChangesIcon />,
//         color: '#AD94E4',
//         bg: '#F0EBFF',
//         isTotal: true,
//     },
//     {
//         key: STATUS_DONE,
//         label: 'المهام المكتملة',
//         icon: <CheckCircleOutlineIcon />,
//         color: '#7DCEA0',
//         bg: '#E4FFF0',
//     },
//     {
//         key: STATUS_RUNNING,
//         label: 'قيد التنفيذ',
//         icon: <AccessTimeIcon />,
//         color: '#83A5FE',
//         bg: '#EEF2FE',
//     },
//     {
//         key: STATUS_NOT_SOLVED,
//         label: 'مهام لم يتم حلها',
//         icon: <ErrorOutlineIcon />,
//         color: '#F1948A',
//         bg: '#FFEBE9',
//     },
// ];

// const ManagerTaskStatistics = () => {
//     const { data: tasks = [] } = useFetchTasksRequestsQuery();
//     const { data: allDepartments = [] } = useFetchDepartmentsQuery();
//     console.log('tasks', tasks)
//     // if (tasksLoading || allDepLoading) return <Typography>Loading...</Typography>;

//     // ===== Global Status Statistics =====
//     const totalTasks = tasks.length;
//     const completedTasks = tasks.filter(t => t.Status === STATUS_DONE).length;
//     const runningTasks = tasks.filter(t => t.Status === STATUS_RUNNING).length;
//     const notSolvedTasks = tasks.filter(t => t.Status === STATUS_NOT_SOLVED).length;

//     // ===== Build Chart Data =====
//     // Option 1: Use all departments and count from tasks
//     const runningByDepartmentMap: Record<string, number> = {};

//     tasks.forEach(task => {
//         if (task.Status === STATUS_RUNNING && task.Department?.Title) {
//             const dep = task.Department.Title;
//             runningByDepartmentMap[dep] = (runningByDepartmentMap[dep] || 0) + 1;
//         }
//     });

//     // Build chart data from all departments
//     const runningDepartmentData = allDepartments.map((dep, index) => ({
//         name: dep.Title,
//         value: runningByDepartmentMap[dep.Title] || 0,
//         color: COLORS[index % COLORS.length],
//     }));

//     // Prepare status values for cards
//     const statusValues = {
//         'total': totalTasks,
//         [STATUS_DONE]: completedTasks,
//         [STATUS_RUNNING]: runningTasks,
//         [STATUS_NOT_SOLVED]: notSolvedTasks,
//     };

//     return (
//         <Box mb={3}>
//             <Grid container spacing={2}>

//                 {/* ---- Donut Chart ---- */}
//                 <Grid item xs={12} md={6}>
//                     <Card sx={{
//                         padding: 2,
//                         borderRadius: 3,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         height: '98%'
//                     }}>
//                         <Typography mb={2} fontWeight="bold">
//                             المهام قيد التنفيذ (حسب الإدارات)
//                         </Typography>

//                         <Box display="flex" alignItems="center" flex={1}>
//                             <Box width="40%" pl={2} height="100%" overflow="auto">
//                                 {runningDepartmentData.map((item, index) => (
//                                     <Box key={index} display="flex" alignItems="center" mb={1}>
//                                         <Box
//                                             width={8}
//                                             height={8}
//                                             borderRadius="50%"
//                                             ml={.7}
//                                             style={{ backgroundColor: item.color }}
//                                         />
//                                         <Typography fontSize={14}>
//                                             {item.name} : {item.value}
//                                         </Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                             <Box width="60%" height="100%">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <PieChart>
//                                         <Pie
//                                             data={runningDepartmentData}
//                                             dataKey="value"
//                                             nameKey="name"
//                                             innerRadius={60}
//                                             outerRadius={90}
//                                         >
//                                             {runningDepartmentData.map((entry, index) => (
//                                                 <Cell key={index} fill={entry.color} />
//                                             ))}
//                                         </Pie>
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                             </Box>
//                         </Box>
//                     </Card>
//                 </Grid>

//                 {/* ---- Status Cards ---- */}
//                 <Grid item xs={12} md={6}>
//                     <Grid container sx={{ height: '100%' }} spacing={1}>
//                         {STATUS_CARDS.map(stat => {
//                             const value = stat.isTotal
//                                 ? totalTasks
//                                 : statusValues[stat.key];

//                             return (
//                                 <Grid item xs={6} key={stat.label} sx={{ height: '50%' }}>
//                                     <Card sx={{
//                                         p: 2,
//                                         borderRadius: 3,
//                                         height: '100%',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         justifyContent: 'center'
//                                     }}>
//                                         <Typography fontSize={14} color="text.secondary" sx={{ textAlign: "right" }} mb={1}>
//                                             {stat.label}
//                                         </Typography>
//                                         <Box display="flex" alignItems="center" justifyContent="space-between" gap={1.5}>
//                                             <Typography fontSize={26} fontWeight={600}>
//                                                 {value}
//                                             </Typography>
//                                             <Box
//                                                 sx={{
//                                                     width: 50,
//                                                     height: 50,
//                                                     borderRadius: '50%',
//                                                     backgroundColor: stat.bg,
//                                                     color: stat.color,
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                 }}
//                                             >
//                                                 {stat.icon}
//                                             </Box>
//                                         </Box>
//                                     </Card>
//                                 </Grid>
//                             );
//                         })}
//                     </Grid>
//                 </Grid>

//             </Grid>
//         </Box>
//     );
// };

// export default ManagerTaskStatistics;






// import React, { useState } from "react";
// import { Box, Typography, Grid, Card } from "@mui/material";
// import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import TrackChangesIcon from '@mui/icons-material/TrackChanges';
// import {
//     useFetchDepartmentsQuery,
//     useFetchTasksRequestsQuery,
// } from "../../../../../store";

// const STATUS_RUNNING = "جاري التنفيذ";
// const STATUS_DONE = "تم الانتهاء";
// const STATUS_NOT_SOLVED = "لم يتم الحل";

// const COLORS = [
//     "#FF6B6B", "#FFA500", "#4CAF50", "#8E44AD",
//     "#3498DB", "#2ECC71", "#E67E22", "#1ABC9C",
// ];

// // Define the type for status cards
// interface StatusCard {
//     key: 'total' | typeof STATUS_DONE | typeof STATUS_RUNNING | typeof STATUS_NOT_SOLVED;
//     label: string;
//     icon: JSX.Element;
//     color: string;
//     bg: string;
//     isTotal?: boolean;
// }

// const STATUS_CARDS: StatusCard[] = [
//     {
//         key: 'total',
//         label: 'جميع المهام',
//         icon: <TrackChangesIcon />,
//         color: '#AD94E4',
//         bg: '#F0EBFF',
//         isTotal: true,
//     },
//     {
//         key: STATUS_DONE,
//         label: 'المهام المكتملة',
//         icon: <CheckCircleOutlineIcon />,
//         color: '#7DCEA0',
//         bg: '#E4FFF0',
//     },
//     {
//         key: STATUS_RUNNING,
//         label: 'قيد التنفيذ',
//         icon: <AccessTimeIcon />,
//         color: '#83A5FE',
//         bg: '#EEF2FE',
//     },
//     {
//         key: STATUS_NOT_SOLVED,
//         label: 'مهام لم يتم حلها',
//         icon: <ErrorOutlineIcon />,
//         color: '#F1948A',
//         bg: '#FFEBE9',
//     },
// ];

// const ManagerTaskStatistics = () => {
//     const { data: tasks = [] } = useFetchTasksRequestsQuery();
//     const { data: allDepartments = [] } = useFetchDepartmentsQuery();
//     const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
//     const [activeIndex, setActiveIndex] = useState<number>(-1);

//     // ===== Handle Pie Chart Cell Click =====
//     const handlePieCellClick = (data: any, index: number) => {
//         if (data && data.name) {
//             // Toggle selection - if clicking the same department, deselect it
//             if (selectedDepartment === data.name) {
//                 setSelectedDepartment(null);
//                 setActiveIndex(-1);
//             } else {
//                 setSelectedDepartment(data.name);
//                 setActiveIndex(index);
//             }
//         }
//     };

//     // Custom active shape renderer
//     const renderActiveShape = (props: any) => {
//         const RADIAN = Math.PI / 180;
//         const {
//             cx,
//             cy,
//             midAngle,
//             innerRadius,
//             outerRadius,
//             startAngle,
//             endAngle,
//             fill,
//             payload,
//             percent,
//             value
//         } = props;
//         const sin = Math.sin(-RADIAN * midAngle);
//         const cos = Math.cos(-RADIAN * midAngle);
//         const sx = cx + (outerRadius + 10) * cos;
//         const sy = cy + (outerRadius + 10) * sin;
//         const mx = cx + (outerRadius + 30) * cos;
//         const my = cy + (outerRadius + 30) * sin;
//         const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//         const ey = my;
//         const textAnchor = cos >= 0 ? 'start' : 'end';

//         return (
//             <g>
//                 <Sector
//                     cx={cx}
//                     cy={cy}
//                     innerRadius={innerRadius}
//                     outerRadius={outerRadius + 5}
//                     startAngle={startAngle}
//                     endAngle={endAngle}
//                     fill={fill}
//                 />
//                 <Sector
//                     cx={cx}
//                     cy={cy}
//                     startAngle={startAngle}
//                     endAngle={endAngle}
//                     innerRadius={innerRadius - 5}
//                     outerRadius={innerRadius}
//                     fill={fill}
//                 />
//                 <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
//                 <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//                 <text
//                     x={ex + (cos >= 0 ? 1 : -1) * 12}
//                     y={ey}
//                     textAnchor={textAnchor}
//                     fill="#333"
//                     fontSize={12}
//                 >
//                     {`${payload.name}: ${value}`}
//                 </text>
//             </g>
//         );
//     };

//     // ===== Filter tasks based on selected department =====
//     const filteredTasks = selectedDepartment
//         ? tasks.filter(task => task.Department?.Title === selectedDepartment)
//         : tasks;

//     // ===== Global Status Statistics (using filtered tasks) =====
//     const totalTasks = filteredTasks.length;
//     const completedTasks = filteredTasks.filter(t => t.Status === STATUS_DONE).length;
//     const runningTasks = filteredTasks.filter(t => t.Status === STATUS_RUNNING).length;
//     const notSolvedTasks = filteredTasks.filter(t => t.Status === STATUS_NOT_SOLVED).length;

//     // ===== Build Chart Data =====
//     const runningByDepartmentMap: Record<string, number> = {};

//     tasks.forEach(task => {
//         if (task.Status === STATUS_RUNNING && task.Department?.Title) {
//             const dep = task.Department.Title;
//             runningByDepartmentMap[dep] = (runningByDepartmentMap[dep] || 0) + 1;
//         }
//     });

//     // Build chart data from all departments
//     const runningDepartmentData = allDepartments.map((dep, index) => ({
//         name: dep.Title,
//         value: runningByDepartmentMap[dep.Title] || 0,
//         color: COLORS[index % COLORS.length],
//         isSelected: selectedDepartment === dep.Title,
//     }));

//     // Prepare status values for cards
//     const statusValues = {
//         'total': totalTasks,
//         [STATUS_DONE]: completedTasks,
//         [STATUS_RUNNING]: runningTasks,
//         [STATUS_NOT_SOLVED]: notSolvedTasks,
//     };

//     // Calculate selected department statistics for tooltip or indicator
//     const selectedDepartmentData = selectedDepartment
//         ? runningDepartmentData.find(dep => dep.name === selectedDepartment)
//         : null;

//     return (
//         <Box mb={3}>
//             {/* Selected Department Indicator */}
//             {selectedDepartment && (
//                 <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
//                     <Typography variant="subtitle1" color="primary">
//                         عرض إحصائيات القسم: <strong>{selectedDepartment}</strong>
//                     </Typography>
//                     <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ cursor: 'pointer' }}
//                         onClick={() => {
//                             setSelectedDepartment(null);
//                             setActiveIndex(-1);
//                         }}
//                     >
//                         إلغاء التحديد
//                     </Typography>
//                 </Box>
//             )}

//             <Grid container spacing={2}>
//                 {/* ---- Donut Chart ---- */}
//                 <Grid item xs={12} md={6}>
//                     <Card sx={{
//                         padding: 2,
//                         borderRadius: 3,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         height: '98%',
//                         position: 'relative',
//                     }}>
//                         <Typography mb={2} fontWeight="bold">
//                             المهام قيد التنفيذ (حسب الإدارات)
//                             {selectedDepartment && (
//                                 <Typography component="span" fontSize="0.9em" color="primary" ml={1}>
//                                     (المحدد: {selectedDepartment})
//                                 </Typography>
//                             )}
//                         </Typography>

//                         <Box display="flex" alignItems="center" flex={1}>
//                             <Box width="40%" pl={2} height="100%" overflow="auto">
//                                 {runningDepartmentData.map((item, index) => (
//                                     <Box
//                                         key={index}
//                                         display="flex"
//                                         alignItems="center"
//                                         mb={1}
//                                         onClick={() => handlePieCellClick(item, index)}
//                                         sx={{
//                                             cursor: 'pointer',
//                                             opacity: selectedDepartment ? (item.isSelected ? 1 : 0.6) : 1,
//                                             backgroundColor: item.isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
//                                             padding: '4px 8px',
//                                             borderRadius: '4px',
//                                             transition: 'all 0.2s ease',
//                                             '&:hover': {
//                                                 backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                                             }
//                                         }}
//                                     >
//                                         <Box
//                                             width={8}
//                                             height={8}
//                                             borderRadius="50%"
//                                             ml={.7}
//                                             style={{ backgroundColor: item.color }}
//                                         />
//                                         <Typography fontSize={14} fontWeight={item.isSelected ? 600 : 400}>
//                                             {item.name} : {item.value}
//                                         </Typography>
//                                     </Box>
//                                 ))}
//                             </Box>

//                             {/* <Box width="40%" height="100%" minHeight="300px">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <PieChart>
//                                         <Pie
//                                             data={runningDepartmentData}
//                                             dataKey="value"
//                                             nameKey="name"
//                                             cx="50%"
//                                             cy="50%"
//                                             innerRadius="40%"  // smaller donut hole
//                                             outerRadius="60%"  // smaller overall pie
//                                             paddingAngle={1}
//                                             onClick={handlePieCellClick}
//                                             activeIndex={activeIndex}
//                                             activeShape={renderActiveShape}
//                                             onMouseEnter={(data, index) => setActiveIndex(index)}
//                                             onMouseLeave={() => setActiveIndex(-1)}
//                                         >
//                                             {runningDepartmentData.map((entry, index) => (
//                                                 <Cell
//                                                     key={index}
//                                                     fill={entry.color}
//                                                     stroke={entry.isSelected ? "#1976d2" : "#ffffff"}
//                                                     strokeWidth={entry.isSelected ? 3 : 2}
//                                                     style={{
//                                                         cursor: 'pointer',
//                                                         opacity: selectedDepartment ? (entry.isSelected ? 1 : 0.6) : 1,
//                                                         transition: 'all 0.2s ease',
//                                                     }}
//                                                 />
//                                             ))}
//                                         </Pie>
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                             </Box> */}


//                             <Box width="60%" height="100%" minHeight="300px">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <PieChart>
//                                         <Pie
//                                             data={runningDepartmentData}
//                                             dataKey="value"
//                                             nameKey="name"
//                                             cx="50%"
//                                             cy="50%"
//                                             innerRadius="65%"  // Increased for smaller donut hole
//                                             outerRadius="85%"  // Increased for thicker ring
//                                             paddingAngle={1}   // Small gap between segments
//                                             onClick={handlePieCellClick}
//                                             activeIndex={activeIndex}
//                                             activeShape={renderActiveShape}
//                                             onMouseEnter={(data, index) => setActiveIndex(index)}
//                                             onMouseLeave={() => setActiveIndex(-1)}
//                                         >
//                                             {runningDepartmentData.map((entry, index) => (
//                                                 <Cell
//                                                     key={index}
//                                                     fill={entry.color}
//                                                     stroke={entry.isSelected ? "#1976d2" : "#ffffff"}
//                                                     strokeWidth={entry.isSelected ? 3 : 2}
//                                                     style={{
//                                                         cursor: 'pointer',
//                                                         opacity: selectedDepartment ? (entry.isSelected ? 1 : 0.6) : 1,
//                                                         transition: 'all 0.2s ease',
//                                                     }}
//                                                 />
//                                             ))}
//                                         </Pie>
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                             </Box>
//                         </Box>
//                     </Card>
//                 </Grid>

//                 {/* ---- Status Cards ---- */}
//                 <Grid item xs={12} md={6}>
//                     <Grid container sx={{ height: '100%' }} spacing={1}>
//                         {STATUS_CARDS.map(stat => {
//                             const value = stat.isTotal
//                                 ? totalTasks
//                                 : statusValues[stat.key];

//                             return (
//                                 <Grid item xs={6} key={stat.label} sx={{ height: '50%' }}>
//                                     <Card sx={{
//                                         p: 2,
//                                         borderRadius: 3,
//                                         height: '100%',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         justifyContent: 'center',
//                                         border: selectedDepartment ? '2px solid #1976d2' : 'none',
//                                         transition: 'border 0.3s ease',
//                                     }}>
//                                         <Typography fontSize={14} color="text.secondary" sx={{ textAlign: "right" }} mb={1}>
//                                             {stat.label}
//                                             {selectedDepartment && (
//                                                 <Typography component="span" fontSize="0.8em" color="primary" ml={1}>
//                                                     ({selectedDepartment})
//                                                 </Typography>
//                                             )}
//                                         </Typography>
//                                         <Box display="flex" alignItems="center" justifyContent="space-between" gap={1.5}>
//                                             <Typography fontSize={26} fontWeight={600}>
//                                                 {value}
//                                             </Typography>
//                                             <Box
//                                                 sx={{
//                                                     width: 50,
//                                                     height: 50,
//                                                     borderRadius: '50%',
//                                                     backgroundColor: stat.bg,
//                                                     color: stat.color,
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                 }}
//                                             >
//                                                 {stat.icon}
//                                             </Box>
//                                         </Box>
//                                         {selectedDepartment && selectedDepartmentData && (
//                                             <Typography variant="caption" color="text.secondary" mt={1}>
//                                                 من أصل {tasks.length} مهمة
//                                             </Typography>
//                                         )}
//                                     </Card>
//                                 </Grid>
//                             );
//                         })}
//                     </Grid>
//                 </Grid>

//             </Grid>
//         </Box>
//     );
// };

// export default ManagerTaskStatistics;
















// // work
// import React, { useState } from "react";
// import { Box, Typography, Grid, Card } from "@mui/material";
// import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import TrackChangesIcon from '@mui/icons-material/TrackChanges';
// import {
//     useFetchDepartmentsQuery,
//     useFetchTasksRequestsQuery,
// } from "../../../../../store";

// const STATUS_RUNNING = "جاري التنفيذ";
// const STATUS_DONE = "تم الانتهاء";
// const STATUS_NOT_SOLVED = "لم يتم الحل";

// const COLORS = [
//     "#FF6B6B", "#FFA500", "#4CAF50", "#8E44AD",
//     "#3498DB", "#2ECC71", "#E67E22", "#1ABC9C",
// ];

// // Define the type for status cards
// interface StatusCard {
//     key: 'total' | typeof STATUS_DONE | typeof STATUS_RUNNING | typeof STATUS_NOT_SOLVED;
//     label: string;
//     icon: JSX.Element;
//     color: string;
//     bg: string;
//     isTotal?: boolean;
// }

// const STATUS_CARDS: StatusCard[] = [
//     {
//         key: 'total',
//         label: 'جميع المهام',
//         icon: <TrackChangesIcon />,
//         color: '#AD94E4',
//         bg: '#F0EBFF',
//         isTotal: true,
//     },
//     {
//         key: STATUS_DONE,
//         label: 'المهام المكتملة',
//         icon: <CheckCircleOutlineIcon />,
//         color: '#7DCEA0',
//         bg: '#E4FFF0',
//     },
//     {
//         key: STATUS_RUNNING,
//         label: 'قيد التنفيذ',
//         icon: <AccessTimeIcon />,
//         color: '#83A5FE',
//         bg: '#EEF2FE',
//     },
//     {
//         key: STATUS_NOT_SOLVED,
//         label: 'مهام لم يتم حلها',
//         icon: <ErrorOutlineIcon />,
//         color: '#F1948A',
//         bg: '#FFEBE9',
//     },
// ];

// // Active shape component for pie chart
// const renderActiveShape = (props: any) => {
//     const RADIAN = Math.PI / 180;
//     const {
//         cx,
//         cy,
//         midAngle,
//         innerRadius,
//         outerRadius,
//         startAngle,
//         endAngle,
//         fill,
//         payload,
//         percent,
//         value,
//     } = props;

//     const sin = Math.sin(-RADIAN * midAngle);
//     const cos = Math.cos(-RADIAN * midAngle);
//     const sx = cx + (outerRadius + 10) * cos;
//     const sy = cy + (outerRadius + 10) * sin;
//     const mx = cx + (outerRadius + 30) * cos;
//     const my = cy + (outerRadius + 30) * sin;
//     const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//     const ey = my;
//     const textAnchor = cos >= 0 ? 'start' : 'end';

//     return (
//         <g>
//             <Sector
//                 cx={cx}
//                 cy={cy}
//                 innerRadius={innerRadius}
//                 outerRadius={outerRadius + 5}
//                 startAngle={startAngle}
//                 endAngle={endAngle}
//                 fill={fill}
//             />
//             <Sector
//                 cx={cx}
//                 cy={cy}
//                 startAngle={startAngle}
//                 endAngle={endAngle}
//                 innerRadius={outerRadius + 6}
//                 outerRadius={outerRadius + 10}
//                 fill={fill}
//             />
//         </g>
//     );
// };

// const ManagerTaskStatistics = () => {
//     const { data: tasks = [] } = useFetchTasksRequestsQuery();
//     const { data: allDepartments = [] } = useFetchDepartmentsQuery();
//     const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
//     const [activeIndex, setActiveIndex] = useState<number>(-1);

//     // ===== Handle Pie Chart Cell Click =====
//     const handlePieCellClick = (data: any, index: number) => {
//         if (data && data.name) {
//             // Toggle selection - if clicking the same department, deselect it
//             if (selectedDepartment === data.name) {
//                 setSelectedDepartment(null);
//                 setActiveIndex(-1);
//             } else {
//                 setSelectedDepartment(data.name);
//                 setActiveIndex(index);
//             }
//         }
//     };

//     const onPieEnter = (_: any, index: number) => {
//         setActiveIndex(index);
//     };

//     const onPieLeave = () => {
//         setActiveIndex(-1);
//     };

//     // ===== Filter tasks based on selected department =====
//     const filteredTasks = selectedDepartment
//         ? tasks.filter(task => task.Department?.Title === selectedDepartment)
//         : tasks;

//     // ===== Global Status Statistics (using filtered tasks) =====
//     const totalTasks = filteredTasks.length;
//     const completedTasks = filteredTasks.filter(t => t.Status === STATUS_DONE).length;
//     const runningTasks = filteredTasks.filter(t => t.Status === STATUS_RUNNING).length;
//     const notSolvedTasks = filteredTasks.filter(t => t.Status === STATUS_NOT_SOLVED).length;

//     // ===== Build Chart Data =====
//     const runningByDepartmentMap: Record<string, number> = {};

//     tasks.forEach(task => {
//         if (task.Status === STATUS_RUNNING && task.Department?.Title) {
//             const dep = task.Department.Title;
//             runningByDepartmentMap[dep] = (runningByDepartmentMap[dep] || 0) + 1;
//         }
//     });

//     // Build chart data from all departments
//     const runningDepartmentData = allDepartments.map((dep, index) => ({
//         name: dep.Title,
//         value: runningByDepartmentMap[dep.Title] || 0,
//         color: COLORS[index % COLORS.length],
//         isSelected: selectedDepartment === dep.Title,
//     }));

//     // Prepare status values for cards
//     const statusValues = {
//         'total': totalTasks,
//         [STATUS_DONE]: completedTasks,
//         [STATUS_RUNNING]: runningTasks,
//         [STATUS_NOT_SOLVED]: notSolvedTasks,
//     };

//     return (
//         <Box mb={3}>
//             {/* Selected Department Indicator */}
//             {selectedDepartment && (
//                 <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
//                     <Typography variant="subtitle1" color="primary">
//                         عرض إحصائيات القسم: <strong>{selectedDepartment}</strong>
//                     </Typography>
//                     <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ cursor: 'pointer' }}
//                         onClick={() => {
//                             setSelectedDepartment(null);
//                             setActiveIndex(-1);
//                         }}
//                     >
//                         إلغاء التحديد
//                     </Typography>
//                 </Box>
//             )}

//             <Grid container spacing={2}>
//                 {/* ---- Donut Chart ---- */}
//                 <Grid item xs={12} md={6}>
//                     <Card sx={{
//                         padding: 2,
//                         borderRadius: 3,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         height: '98%',
//                         position: 'relative',
//                     }}>
//                         <Typography mb={2} fontWeight="bold">
//                             المهام قيد التنفيذ (حسب الإدارات)
//                             {selectedDepartment && (
//                                 <Typography component="span" fontSize="0.9em" color="primary" ml={1}>
//                                     (المحدد: {selectedDepartment})
//                                 </Typography>
//                             )}
//                         </Typography>

//                         <Box display="flex" alignItems="center" flex={1}>
//                             <Box width="40%" pl={2} height="100%" overflow="auto">
//                                 {runningDepartmentData.map((item, index) => (
//                                     <Box
//                                         key={index}
//                                         display="flex"
//                                         alignItems="center"
//                                         mb={1}
//                                         onClick={() => handlePieCellClick(item, index)}
//                                         sx={{
//                                             cursor: 'pointer',
//                                             opacity: selectedDepartment ? (item.isSelected ? 1 : 0.6) : 1,
//                                             backgroundColor: item.isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
//                                             padding: '4px 8px',
//                                             borderRadius: '4px',
//                                             transition: 'all 0.2s ease',
//                                             '&:hover': {
//                                                 backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                                             }
//                                         }}
//                                     >
//                                         <Box
//                                             width={8}
//                                             height={8}
//                                             borderRadius="50%"
//                                             ml={.7}
//                                             style={{ backgroundColor: item.color }}
//                                         />
//                                         <Typography fontSize={14} fontWeight={item.isSelected ? 600 : 400}>
//                                             {item.name} : {item.value}
//                                         </Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                             <Box width="60%" height="100%">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <PieChart>
//                                         <Pie
//                                             data={runningDepartmentData}
//                                             dataKey="value"
//                                             nameKey="name"
//                                             innerRadius={60}
//                                             outerRadius={90}
//                                             onClick={handlePieCellClick}
//                                             onMouseEnter={onPieEnter}
//                                             onMouseLeave={onPieLeave}
//                                             activeIndex={activeIndex}
//                                             activeShape={renderActiveShape}
//                                         >
//                                             {runningDepartmentData.map((entry, index) => (
//                                                 <Cell
//                                                     key={index}
//                                                     fill={entry.color}
//                                                     stroke={entry.isSelected ? "#1976d2" : "none"}
//                                                     strokeWidth={entry.isSelected ? 3 : 1}
//                                                     style={{
//                                                         cursor: 'pointer',
//                                                         opacity: selectedDepartment ? (entry.isSelected ? 1 : 0.6) : 1,
//                                                         transition: 'all 0.2s ease',
//                                                     }}
//                                                 />
//                                             ))}
//                                         </Pie>
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                             </Box>
//                         </Box>
//                     </Card>
//                 </Grid>

//                 {/* ---- Status Cards ---- */}
//                 <Grid item xs={12} md={6}>
//                     <Grid container sx={{ height: '100%' }} spacing={1}>
//                         {STATUS_CARDS.map(stat => {
//                             const value = stat.isTotal
//                                 ? totalTasks
//                                 : statusValues[stat.key];

//                             return (
//                                 <Grid item xs={6} key={stat.label} sx={{ height: '50%' }}>
//                                     <Card sx={{
//                                         p: 2,
//                                         borderRadius: 3,
//                                         height: '100%',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         justifyContent: 'center',
//                                         border: selectedDepartment ? '2px solid #1976d2' : 'none',
//                                         transition: 'border 0.3s ease',
//                                     }}>
//                                         <Typography fontSize={14} color="text.secondary" sx={{ textAlign: "right" }} mb={1}>
//                                             {stat.label}
//                                             {selectedDepartment && (
//                                                 <Typography component="span" fontSize="0.8em" color="primary" ml={1}>
//                                                     ({selectedDepartment})
//                                                 </Typography>
//                                             )}
//                                         </Typography>
//                                         <Box display="flex" alignItems="center" justifyContent="space-between" gap={1.5}>
//                                             <Typography fontSize={26} fontWeight={600}>
//                                                 {value}
//                                             </Typography>
//                                             <Box
//                                                 sx={{
//                                                     width: 50,
//                                                     height: 50,
//                                                     borderRadius: '50%',
//                                                     backgroundColor: stat.bg,
//                                                     color: stat.color,
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                 }}
//                                             >
//                                                 {stat.icon}
//                                             </Box>
//                                         </Box>
//                                         {selectedDepartment && (
//                                             <Typography variant="caption" color="text.secondary" mt={1}>
//                                                 من أصل {tasks.length} مهمة
//                                             </Typography>
//                                         )}
//                                     </Card>
//                                 </Grid>
//                             );
//                         })}
//                     </Grid>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default ManagerTaskStatistics;















// with toolitp
// import React, { useState } from "react";
// import { Box, Typography, Grid, Card } from "@mui/material";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     ResponsiveContainer,
//     Sector,
//     Tooltip // Add this import
// } from "recharts";
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import TrackChangesIcon from '@mui/icons-material/TrackChanges';
// import {
//     useFetchDepartmentsQuery,
//     useFetchTasksRequestsQuery,
// } from "../../../../../store";

// const STATUS_RUNNING = "جاري التنفيذ";
// const STATUS_DONE = "تم الانتهاء";
// const STATUS_NOT_SOLVED = "لم يتم الحل";

// const COLORS = [
//     "#FF6B6B", "#FFA500", "#4CAF50", "#8E44AD",
//     "#3498DB", "#2ECC71", "#E67E22", "#1ABC9C",
// ];

// // Define the type for status cards
// interface StatusCard {
//     key: 'total' | typeof STATUS_DONE | typeof STATUS_RUNNING | typeof STATUS_NOT_SOLVED;
//     label: string;
//     icon: JSX.Element;
//     color: string;
//     bg: string;
//     isTotal?: boolean;
// }

// const STATUS_CARDS: StatusCard[] = [
//     {
//         key: 'total',
//         label: 'جميع المهام',
//         icon: <TrackChangesIcon />,
//         color: '#AD94E4',
//         bg: '#F0EBFF',
//         isTotal: true,
//     },
//     {
//         key: STATUS_DONE,
//         label: 'المهام المكتملة',
//         icon: <CheckCircleOutlineIcon />,
//         color: '#7DCEA0',
//         bg: '#E4FFF0',
//     },
//     {
//         key: STATUS_RUNNING,
//         label: 'قيد التنفيذ',
//         icon: <AccessTimeIcon />,
//         color: '#83A5FE',
//         bg: '#EEF2FE',
//     },
//     {
//         key: STATUS_NOT_SOLVED,
//         label: 'مهام لم يتم حلها',
//         icon: <ErrorOutlineIcon />,
//         color: '#F1948A',
//         bg: '#FFEBE9',
//     },
// ];

// // Custom tooltip component for better styling
// const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//         return (
//             <Box
//                 sx={{
//                     backgroundColor: 'white',
//                     padding: '10px 15px',
//                     borderRadius: '8px',
//                     boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.1)',
//                     border: '1px solid #e0e0e0',
//                 }}
//             >
//                 <Typography variant="body2" fontWeight="bold" color="text.primary">
//                     {payload[0].name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                     عدد المهام: <strong>{payload[0].value}</strong>
//                 </Typography>
//                 {payload[0].payload.percentage && (
//                     <Typography variant="body2" color="text.secondary">
//                         النسبة: <strong>{payload[0].payload.percentage}%</strong>
//                     </Typography>
//                 )}
//             </Box>
//         );
//     }
//     return null;
// };

// // Active shape component for pie chart
// const renderActiveShape = (props: any) => {
//     const RADIAN = Math.PI / 180;
//     const {
//         cx,
//         cy,
//         midAngle,
//         innerRadius,
//         outerRadius,
//         startAngle,
//         endAngle,
//         fill,
//         payload,
//         percent,
//         value,
//     } = props;

//     const sin = Math.sin(-RADIAN * midAngle);
//     const cos = Math.cos(-RADIAN * midAngle);
//     const sx = cx + (outerRadius + 10) * cos;
//     const sy = cy + (outerRadius + 10) * sin;
//     const mx = cx + (outerRadius + 30) * cos;
//     const my = cy + (outerRadius + 30) * sin;
//     const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//     const ey = my;
//     const textAnchor = cos >= 0 ? 'start' : 'end';

//     return (
//         <g>
//             <Sector
//                 cx={cx}
//                 cy={cy}
//                 innerRadius={innerRadius}
//                 outerRadius={outerRadius + 5}
//                 startAngle={startAngle}
//                 endAngle={endAngle}
//                 fill={fill}
//             />
//             <Sector
//                 cx={cx}
//                 cy={cy}
//                 startAngle={startAngle}
//                 endAngle={endAngle}
//                 innerRadius={outerRadius + 6}
//                 outerRadius={outerRadius + 10}
//                 fill={fill}
//             />
//         </g>
//     );
// };

// const ManagerTaskStatistics = () => {
//     const { data: tasks = [] } = useFetchTasksRequestsQuery();
//     const { data: allDepartments = [] } = useFetchDepartmentsQuery();
//     const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
//     const [activeIndex, setActiveIndex] = useState<number>(-1);

//     // ===== Handle Pie Chart Cell Click =====
//     const handlePieCellClick = (data: any, index: number) => {
//         if (data && data.name) {
//             // Toggle selection - if clicking the same department, deselect it
//             if (selectedDepartment === data.name) {
//                 setSelectedDepartment(null);
//                 setActiveIndex(-1);
//             } else {
//                 setSelectedDepartment(data.name);
//                 setActiveIndex(index);
//             }
//         }
//     };

//     const onPieEnter = (_: any, index: number) => {
//         setActiveIndex(index);
//     };

//     const onPieLeave = () => {
//         setActiveIndex(-1);
//     };

//     // ===== Filter tasks based on selected department =====
//     const filteredTasks = selectedDepartment
//         ? tasks.filter(task => task.Department?.Title === selectedDepartment)
//         : tasks;

//     // ===== Global Status Statistics (using filtered tasks) =====
//     const totalTasks = filteredTasks.length;
//     const completedTasks = filteredTasks.filter(t => t.Status === STATUS_DONE).length;
//     const runningTasks = filteredTasks.filter(t => t.Status === STATUS_RUNNING).length;
//     const notSolvedTasks = filteredTasks.filter(t => t.Status === STATUS_NOT_SOLVED).length;

//     // ===== Build Chart Data =====
//     const runningByDepartmentMap: Record<string, number> = {};

//     tasks.forEach(task => {
//         if (task.Status === STATUS_RUNNING && task.Department?.Title) {
//             const dep = task.Department.Title;
//             runningByDepartmentMap[dep] = (runningByDepartmentMap[dep] || 0) + 1;
//         }
//     });

//     // Calculate total running tasks for percentage calculation
//     const totalRunningTasks = Object.values(runningByDepartmentMap).reduce((a, b) => a + b, 0);

//     // Build chart data from all departments
//     const runningDepartmentData = allDepartments.map((dep, index) => {
//         const value = runningByDepartmentMap[dep.Title] || 0;
//         const percentage = totalRunningTasks > 0 ? Math.round((value / totalRunningTasks) * 100) : 0;

//         return {
//             name: dep.Title,
//             value: value,
//             percentage: percentage,
//             color: COLORS[index % COLORS.length],
//             isSelected: selectedDepartment === dep.Title,
//         };
//     });

//     // Prepare status values for cards
//     const statusValues = {
//         'total': totalTasks,
//         [STATUS_DONE]: completedTasks,
//         [STATUS_RUNNING]: runningTasks,
//         [STATUS_NOT_SOLVED]: notSolvedTasks,
//     };

//     return (
//         <Box mb={3}>
//             {/* Selected Department Indicator */}
//             {selectedDepartment && (
//                 <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
//                     <Typography variant="subtitle1" color="primary">
//                         عرض إحصائيات القسم: <strong>{selectedDepartment}</strong>
//                     </Typography>
//                     <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ cursor: 'pointer' }}
//                         onClick={() => {
//                             setSelectedDepartment(null);
//                             setActiveIndex(-1);
//                         }}
//                     >
//                         إلغاء التحديد
//                     </Typography>
//                 </Box>
//             )}

//             <Grid container spacing={2}>
//                 {/* ---- Donut Chart ---- */}
//                 <Grid item xs={12} md={6}>
//                     <Card sx={{
//                         padding: 2,
//                         borderRadius: 3,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         height: '98%',
//                         position: 'relative',
//                     }}>
//                         <Typography mb={2} fontWeight="bold">
//                             المهام قيد التنفيذ (حسب الإدارات)
//                             {selectedDepartment && (
//                                 <Typography component="span" fontSize="0.9em" color="primary" ml={1}>
//                                     (المحدد: {selectedDepartment})
//                                 </Typography>
//                             )}
//                         </Typography>

//                         <Box display="flex" alignItems="center" flex={1}>
//                             <Box width="40%" pl={2} height="100%" overflow="auto">
//                                 {runningDepartmentData.map((item, index) => (
//                                     <Box
//                                         key={index}
//                                         display="flex"
//                                         alignItems="center"
//                                         mb={1}
//                                         onClick={() => handlePieCellClick(item, index)}
//                                         sx={{
//                                             cursor: 'pointer',
//                                             opacity: selectedDepartment ? (item.isSelected ? 1 : 0.6) : 1,
//                                             backgroundColor: item.isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
//                                             padding: '4px 8px',
//                                             borderRadius: '4px',
//                                             transition: 'all 0.2s ease',
//                                             '&:hover': {
//                                                 backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                                             }
//                                         }}
//                                     >
//                                         <Box
//                                             width={8}
//                                             height={8}
//                                             borderRadius="50%"
//                                             ml={.7}
//                                             style={{ backgroundColor: item.color }}
//                                         />
//                                         <Typography fontSize={14} fontWeight={item.isSelected ? 600 : 400}>
//                                             {item.name} : {item.value}
//                                         </Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                             <Box width="60%" height="100%">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <PieChart>
//                                         {/* Add Tooltip component here */}
//                                         <Tooltip
//                                             content={<CustomTooltip />}
//                                             cursor={{ fill: 'transparent' }}
//                                         />
//                                         <Pie
//                                             data={runningDepartmentData}
//                                             dataKey="value"
//                                             nameKey="name"
//                                             innerRadius={60}
//                                             outerRadius={90}
//                                             onClick={handlePieCellClick}
//                                             onMouseEnter={onPieEnter}
//                                             onMouseLeave={onPieLeave}
//                                             activeIndex={activeIndex}
//                                             activeShape={renderActiveShape}
//                                         >
//                                             {runningDepartmentData.map((entry, index) => (
//                                                 <Cell
//                                                     key={index}
//                                                     fill={entry.color}
//                                                     stroke={entry.isSelected ? "#1976d2" : "none"}
//                                                     strokeWidth={entry.isSelected ? 3 : 1}
//                                                     style={{
//                                                         cursor: 'pointer',
//                                                         opacity: selectedDepartment ? (entry.isSelected ? 1 : 0.6) : 1,
//                                                         transition: 'all 0.2s ease',
//                                                     }}
//                                                 />
//                                             ))}
//                                         </Pie>
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                             </Box>
//                         </Box>
//                     </Card>
//                 </Grid>

//                 {/* ---- Status Cards ---- */}
//                 <Grid item xs={12} md={6}>
//                     <Grid container sx={{ height: '100%' }} spacing={1}>
//                         {STATUS_CARDS.map(stat => {
//                             const value = stat.isTotal
//                                 ? totalTasks
//                                 : statusValues[stat.key];

//                             return (
//                                 <Grid item xs={6} key={stat.label} sx={{ height: '50%' }}>
//                                     <Card sx={{
//                                         p: 2,
//                                         borderRadius: 3,
//                                         height: '100%',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         justifyContent: 'center',
//                                         border: selectedDepartment ? '2px solid #1976d2' : 'none',
//                                         transition: 'border 0.3s ease',
//                                     }}>
//                                         <Typography fontSize={14} color="text.secondary" sx={{ textAlign: "right" }} mb={1}>
//                                             {stat.label}
//                                             {selectedDepartment && (
//                                                 <Typography component="span" fontSize="0.8em" color="primary" ml={1}>
//                                                     ({selectedDepartment})
//                                                 </Typography>
//                                             )}
//                                         </Typography>
//                                         <Box display="flex" alignItems="center" justifyContent="space-between" gap={1.5}>
//                                             <Typography fontSize={26} fontWeight={600}>
//                                                 {value}
//                                             </Typography>
//                                             <Box
//                                                 sx={{
//                                                     width: 50,
//                                                     height: 50,
//                                                     borderRadius: '50%',
//                                                     backgroundColor: stat.bg,
//                                                     color: stat.color,
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                 }}
//                                             >
//                                                 {stat.icon}
//                                             </Box>
//                                         </Box>
//                                         {selectedDepartment && (
//                                             <Typography variant="caption" color="text.secondary" mt={1}>
//                                                 من أصل {tasks.length} مهمة
//                                             </Typography>
//                                         )}
//                                     </Card>
//                                 </Grid>
//                             );
//                         })}
//                     </Grid>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default ManagerTaskStatistics;