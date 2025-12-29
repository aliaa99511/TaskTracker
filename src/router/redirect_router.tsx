import * as React from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useFetchEmployeeByIdQuery, useFetchEmployeeIdQuery } from "../store";

export const RedirectRouter: React.FC = () => {
    const navigate = useNavigate();
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: employeeDataInfo, isLoading } = useFetchEmployeeByIdQuery(employeeId as number, {
        skip: !employeeId,
    });

    useEffect(() => {
        if (!employeeDataInfo || isLoading) return;

        let path = "";
        // let path = "/myPendingTasksLog"; 

        if (employeeDataInfo.EmployeeType === "CEO") {
            path = "/managerRecentTasksLog";
        }
        else if (employeeDataInfo.EmployeeType === "Employee") {
            path = "/myPendingTasksLog"; // Already set as default
        }

        navigate(path);
    }, [employeeDataInfo, isLoading, navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
        >
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2 }}>
                جاري التوجيه إلى الصفحة المناسبة...
            </Typography>
        </Box>
    );
};