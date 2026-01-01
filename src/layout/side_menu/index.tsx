import * as React from 'react';
import { Box, List, Paper, useTheme } from '@mui/material';
import MenuLink from './link';
import { MenuItem } from '../../webparts/tasksTracker/components/ITasksTrackerProps';

const SideMenu: React.FC<{ navItems: MenuItem[] }> = ({ navItems }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                width: "100%",
                backgroundColor: theme.palette.background.paper,
                height: "100%",
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 0,
                borderRight: `1px solid ${theme.palette.divider}`,
            }}
        >
            {/* All navigation items in one scrollable area */}
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: theme.palette.action.disabled,
                    borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: theme.palette.action.disabledBackground,
                }
            }}>
                <List
                    component="nav"
                    sx={{
                        p: 0,
                    }}
                >
                    {navItems.map((item: MenuItem, index: number) => {
                        // Check if this is the About item
                        const isAboutItem = item.label === "عن التطبيق";

                        return (
                            <MenuLink
                                key={index}
                                item={item}
                                isAboutItem={isAboutItem} // Pass this prop to MenuLink
                                sx={isAboutItem ? {
                                    // Special styling for About item
                                    backgroundColor: theme.palette.grey[50],
                                    color: "#656768",
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                                    marginTop: 2, // Add some space before About item
                                } : {}}
                            />
                        );
                    })}
                </List>
            </Box>
        </Paper>
    );
}

export default SideMenu;