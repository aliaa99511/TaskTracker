import React from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useFetchEmployeeByIdQuery, useFetchEmployeeIdQuery } from "../store";

const styles = {
    ml: 1,
    color: 'primary.main'
} as const;

export interface NavItem {
    label: string;
    to?: string; // Make to optional since About won't have a route
    icon: React.ReactNode;
    onClick?: () => void; // Add onClick handler for About
}

// Routes configuration
import InfoIcon from '@mui/icons-material/Info';

const ROUTES_CONFIG = {
    EMPLOYEE: {
        PENDING_TASKS: {
            label: "قيد الإنتظار",
            to: "/myPendingTasksLog",
            icon: <HourglassBottomIcon fontSize="small" sx={styles} />
        },
        TASKS_LOG: {
            label: "سجل المهام",
            to: "/myTasksLog",
            icon: <DashboardIcon fontSize="small" sx={styles} />
        }
    },
    MANAGER: {
        RECENT_TASKS: {
            label: "الرئيسية",
            to: "/managerRecentTasksLog",
            icon: <DashboardIcon fontSize="small" sx={styles} />
        },
        TEAM_TASKS: {
            label: "سجل المهام",
            to: "/managerTasksLog",
            icon: <DashboardIcon fontSize="small" sx={styles} />
        }
    },
    COMMON: {
        ABOUT: {
            label: "عن التطبيق",
            icon: <InfoIcon fontSize="small" sx={styles} />
            // to and onClick will be added dynamically
        }
    }
};

// Custom hook for employee data
const useEmployeeData = () => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: employeeDataInfo } = useFetchEmployeeByIdQuery(employeeId as number, {
        skip: !employeeId,
    });

    return { employeeDataInfo };
};

// Main function - now returns navItems with About having onClick
export const getNavItemsByRole = (roles: string[], employeeDataInfo?: any, onAboutClick?: () => void): NavItem[] => {
    const navItems: NavItem[] = [];

    if (!employeeDataInfo) return navItems;

    const employeeType = employeeDataInfo.EmployeeType;

    if (employeeType === "Employee") {
        navItems.push(
            ROUTES_CONFIG.EMPLOYEE.PENDING_TASKS,
            ROUTES_CONFIG.EMPLOYEE.TASKS_LOG
        );
    }
    else if (employeeType === "CEO") {
        navItems.push(
            ROUTES_CONFIG.MANAGER.RECENT_TASKS,
            ROUTES_CONFIG.MANAGER.TEAM_TASKS
        );
    }

    // 👈 Add About with onClick handler
    navItems.push({
        ...ROUTES_CONFIG.COMMON.ABOUT,
        onClick: onAboutClick
    });

    return navItems;
};

// Hook version for component usage
export const useNavItemsByRole = (roles: string[], onAboutClick?: () => void): NavItem[] => {
    const { employeeDataInfo } = useEmployeeData();
    return React.useMemo(
        () => getNavItemsByRole(roles, employeeDataInfo, onAboutClick),
        [roles, employeeDataInfo, onAboutClick]
    );
};