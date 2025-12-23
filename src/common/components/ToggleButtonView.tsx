import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';

interface ToggleButtonViewProps {
    view: 'table' | 'cards';
    setView: (view: 'table' | 'cards') => void;
}

const ToggleButtonView: React.FC<ToggleButtonViewProps> = ({ view, setView }) => {
    return (
        <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            sx={{
                backgroundColor: '#F5F7FA',
                borderRadius: 2.5,
                p: 0.5,
                gap: 0.5,
                '& .MuiToggleButtonGroup-grouped': {
                    border: 0,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    py: 0.8,
                    '&.Mui-selected': {
                        backgroundColor: '#fff',
                        color: 'primary.main',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    },
                    color: 'gray',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                    },
                },
            }}
        >
            <ToggleButton value="table">
                <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="cards">
                <GridViewIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ToggleButtonView;
