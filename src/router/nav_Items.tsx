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
    to: string;
    icon: React.ReactNode;
}

// Routes configuration
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
    }
} as const;

// Custom hook for employee data
const useEmployeeData = () => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: employeeDataInfo } = useFetchEmployeeByIdQuery(employeeId as number, {
        skip: !employeeId,
    });

    return { employeeDataInfo };
};

// Main function - now uses EmployeeType instead of roles array
export const getNavItemsByRole = (roles: string[], employeeDataInfo?: any): NavItem[] => {
    const navItems: NavItem[] = [];

    if (!employeeDataInfo) {
        return navItems;
    }

    const employeeType = employeeDataInfo.EmployeeType;

    // Add routes based on EmployeeType
    if (employeeType === "Employee") {
        navItems.push(
            ROUTES_CONFIG.EMPLOYEE.PENDING_TASKS,
            ROUTES_CONFIG.EMPLOYEE.TASKS_LOG
        );
    } else if (employeeType === "CEO") {
        navItems.push(
            ROUTES_CONFIG.MANAGER.RECENT_TASKS,
            ROUTES_CONFIG.MANAGER.TEAM_TASKS
        );
    }

    return navItems;
};

// Hook version for component usage
export const useNavItemsByRole = (roles: string[]): NavItem[] => {
    const { employeeDataInfo } = useEmployeeData();
    return React.useMemo(
        () => getNavItemsByRole(roles, employeeDataInfo),
        [roles, employeeDataInfo]
    );
};