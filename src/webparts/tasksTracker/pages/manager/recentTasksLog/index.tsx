import React, { useState, useCallback } from 'react'
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

    const [view, setView] = useState<'table' | 'cards'>('table');
    const [activeCommentRowId, setActiveCommentRowId] = useState<number | null>(null);
    const [commentAnchorEl, setCommentAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Handle click outside to close comment box
    const handleGridClick = useCallback(() => {
        setActiveCommentRowId(null);
        setCommentAnchorEl(null);
    }, []);

    const columns = getManagerColumns(
        undefined,
        undefined,
        activeCommentRowId,
        setActiveCommentRowId
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
                    <Box onClick={handleGridClick}>
                        <CustomDataGrid
                            rows={recentTasks}
                            columns={columns}
                            isLoading={isLoading}
                            getRowHeight={() => 'auto'}
                            sx={{
                                ...dataGridStyles,
                                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                                    outline: 'none',
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
                    />
                )}
            </Box>
        </Box>
    )
}

export default ManagerRecentTasksLog;