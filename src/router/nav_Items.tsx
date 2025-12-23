import React from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const getNavItemsByRole = (role: string[]) => {
    const base = [
        {
            label: "قيد التنفيذ",
            to: "/myPendingTasksLog",
            icon: <HourglassBottomIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />
        },
        {
            label: "سجل المهام",
            to: "/myTasks",
            icon: <DashboardIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />
        },
    ];

    // if (role.includes("manager")) {
    //     base.push(
    //         {
    //             label: "لوحة التحكم",
    //             to: "/dashboard",
    //             icon: <DashboardIcon fontSize="small" />
    //         },
    //         {
    //             label: "مهام الفريق",
    //             to: "/teamTasksLog",
    //             icon: <GroupWorkIcon fontSize="small" />
    //         }
    //     );
    // }

    return base;
};
