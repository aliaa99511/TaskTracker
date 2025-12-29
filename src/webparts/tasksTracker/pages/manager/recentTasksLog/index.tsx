import React from 'react'
import { useFetchRecentTasksRequestsQuery } from '../../../../../store';
import { getManagerColumns } from '../../../../../common/components/CommonColumns';
import { Box, Typography } from '@mui/material';
import CustomDataGrid from '../../../../../common/table';
import { dataGridStyles } from '../../../../../assets/styles/TableStyles/dataGridStyles.';
import TaskCardsView from '../../components/cardsView/TaskCardsView';
import ToggleButtonView from '../../../../../common/components/ToggleButtonView';

const ManagerRecentTasksLog = () => {
    const { data: recentTasks = [], isLoading } = useFetchRecentTasksRequestsQuery();

    console.log('recentTasks', recentTasks)

    const [view, setView] = React.useState<'table' | 'cards'>('table');

    const columns = getManagerColumns(
        undefined,
        undefined
    );
    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ background: "#fff", p: 3, borderRadius: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box>
                        <Typography variant="h5">المهام المعلقة</Typography>
                        <Typography fontSize={14} color="text.secondary">
                            {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                    {/* View Switch */}
                    <ToggleButtonView
                        view={view}
                        setView={setView}
                    />
                </Box>

                {/* Content */}
                {view === 'table' ? (
                    <CustomDataGrid
                        rows={recentTasks}
                        columns={columns}
                        isLoading={isLoading}
                        getRowHeight={() => 'auto'}
                        sx={dataGridStyles}
                        hideQuickFilter
                    />
                ) : (
                    <TaskCardsView
                        tasks={recentTasks}
                    />
                )}
            </Box>
        </Box>
    )
}

export default ManagerRecentTasksLog