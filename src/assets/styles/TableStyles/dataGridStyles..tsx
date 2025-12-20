export const dataGridStyles = {
    '& .MuiDataGrid-cell': {
        display: 'flex',
        alignItems: 'center',
        py: "12px"
    },
    '& .MuiDataGrid-cell .MuiTypography-root': {
        color: 'text.primary'
    },
    '& .weekend-row, & .holiday-row, & .vacation-row': {
        backgroundColor: 'action.hover',
        '&:hover': {
            backgroundColor: 'action.selected',
        },
    },
    '& .empty-day': {
        minHeight: '60px',
        '& .MuiDataGrid-cell': {
            color: 'text.disabled',
        }
    },
};