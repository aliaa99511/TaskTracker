import React, { useState, useCallback } from 'react'
import { useFetchRecentTasksRequestsQuery } from '../../../../../store';
import { getManagerColumns } from '../../components/tableColumns';
import { Box, Typography } from '@mui/material';
import CustomDataGrid from '../../../../../common/table';
import { dataGridStyles } from '../../../../../assets/styles/TableStyles/dataGridStyles.';
import TaskCardsView from '../../components/taskCardsView';
import ToggleButtonView from '../../../../../common/components/ToggleButtonView';
import ManagerTaskStatistics from '../statistics/ManagerTaskStatistics';
import TaskDetailsDialog from '../../components/taskdetails';

const ManagerRecentTasksLog = () => {
    const { data: recentTasks = [], isLoading } = useFetchRecentTasksRequestsQuery();

    const [view, setView] = useState<'table' | 'cards'>('table');
    const [activeCommentRowId, setActiveCommentRowId] = useState<number | null>(null);
    const [commentAnchorEl, setCommentAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedTask, setSelectedTask] = useState<any>(null); // Add selected task state
    const [detailsModalOpen, setDetailsModalOpen] = useState(false); // Add modal open state

    // Handle click outside to close comment box
    const handleGridClick = useCallback(() => {
        setActiveCommentRowId(null);
        setCommentAnchorEl(null);
    }, []);

    // Handle row click in data grid
    const handleRowClick = useCallback((params: any) => {
        setSelectedTask(params.row);
        setDetailsModalOpen(true);
    }, []);

    // Handle card click in cards view
    const handleCardClick = useCallback((task: any) => {
        setSelectedTask(task);
        setDetailsModalOpen(true);
    }, []);

    // Close details modal
    const handleCloseDetailsModal = useCallback(() => {
        setDetailsModalOpen(false);
        setSelectedTask(null);
    }, []);

    const columns = getManagerColumns(
        undefined,
        undefined,
        activeCommentRowId,
        setActiveCommentRowId
    );

    return (
        <Box sx={{ p: 1.3 }}>
            {/* Statistics */}
            <ManagerTaskStatistics />

            <Box sx={{ background: "#fff", p: 2, borderRadius: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between">
                    <Box>
                        <Typography variant="h5">المهام المعلقة</Typography>
                    </Box>
                    {/* View Switch */}
                    <ToggleButtonView
                        view={view}
                        setView={setView}
                    />
                </Box>

                {/* Content */}
                {view === 'table' ? (
                    <Box onClick={handleGridClick}>
                        <CustomDataGrid
                            rows={recentTasks}
                            columns={columns}
                            isLoading={isLoading}
                            getRowHeight={() => 'auto'}
                            onRowClick={handleRowClick}
                            sx={{
                                ...dataGridStyles,
                                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                            hideQuickFilter
                        />
                    </Box>
                ) : (
                    <TaskCardsView
                        tasks={recentTasks}
                        activeCommentRowId={activeCommentRowId}
                        setActiveCommentRowId={setActiveCommentRowId}
                        commentAnchorEl={commentAnchorEl}
                        setCommentAnchorEl={setCommentAnchorEl}
                        onCardClick={handleCardClick}
                    />
                )}
            </Box>

            {/* Task Details Modal */}
            <TaskDetailsDialog
                open={detailsModalOpen}
                onClose={handleCloseDetailsModal}
                task={selectedTask}
            />
        </Box>
    )
}

export default ManagerRecentTasksLog;