
import * as React from 'react';
import { Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { getPriorityColor, getStatusColor } from '../utils/helpers';

export const getColumns = (
    LogType: string,
    Type?: string,
    isManager?: boolean,
): GridColDef[] => {
    const baseColumns: GridColDef[] = [
        // ...(LogType !== 'employee' ? [
        {
            field: "Employee",
            headerName: "الإسم",
            flex: .5,
            renderCell: (params: any) => {
                return params.value?.Title || "-";
            },
        },
        // ] : []),

        // ...(Type !== 'Pending' ? [
        {
            field: "Status",
            headerName: "الحالة",
            flex: .6,
            renderCell: (params: any) => {
                const status = params.value;
                const styles = getStatusColor(status);

                return (
                    <Chip
                        label={status}
                        sx={{
                            backgroundColor: styles.backgroundColor,
                            color: styles.color,
                            '& .MuiChip-label': {
                                px: 1
                            }
                        }}
                        size="small"
                        variant="filled"
                    />
                );
            }
        },
        // ] : []),

        {
            field: "Title",
            headerName: "المهمة",
            flex: 1,
            renderCell: (params: any) => {
                return params.value || "-";
            },
        },
        {
            field: "ConcernedEntity",
            headerName: "الجهة المسؤولة",
            flex: .7,
            renderCell: (params: any) => {
                return params.value || "-";
            },
        },
        {
            field: "TaskType",
            headerName: "نوع النشاط",
            flex: .7,
            renderCell: (params: any) => {
                return params.value?.Title || "-";
            },
        },
        {
            field: "Priority",
            headerName: "الأولوية",
            flex: .5,
            renderCell: (params: any) => {
                const priority = params.value;
                const styles = getPriorityColor(priority);

                return (
                    <Chip
                        label={priority}
                        sx={{
                            backgroundColor: styles.backgroundColor,
                            color: styles.color,
                            '& .MuiChip-label': {
                                px: 1
                            }
                        }}
                        size="small"
                        variant="filled"
                    />
                );
            }
        },
        {
            field: "DueDate",
            headerName: "موعد التسليم",
            type: "date",
            flex: .5,
            valueGetter: (value: any) => new Date(value),
            renderCell: (params: any) => {
                if (!params.value) return "";
                const date = typeof params.value === 'string' ? new Date(params.value) : params.value;
                return date.toLocaleDateString('ar-GB');
            },
        },
    ];

    if (LogType === "employee") {
        return baseColumns.filter(column => column.field !== "Employee");
    }

    return baseColumns;
}