import * as React from 'react';
import { Box, List, Paper, useTheme } from '@mui/material';
import MenuLink from './link';
import { MenuItem } from '../../webparts/tasksTracker/components/ITasksTrackerProps';

const SideMenu: React.FC<{ navItems: MenuItem[] }> = ({ navItems }) => {
    const theme = useTheme();

    // Find About item and other items
    const aboutItemIndex = navItems.findIndex((item: MenuItem) => item.label === "عن التطبيق");
    const aboutItem = aboutItemIndex >= 0 ? navItems[aboutItemIndex] : null;
    const otherItems = aboutItemIndex >= 0
        ? [...navItems.slice(0, aboutItemIndex), ...navItems.slice(aboutItemIndex + 1)]
        : navItems;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                width: "100%",
                backgroundColor: theme.palette.background.paper,
                height: "100%", // Changed from 100vh to 100%
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 0,
                borderRight: `1px solid ${theme.palette.divider}`,
            }}
        >
            {/* Main navigation items - with scroll if needed */}
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
                    {otherItems.map((item: MenuItem, index: number) =>
                        <MenuLink key={index} item={item} />
                    )}
                </List>
            </Box>

            {/* About item at the bottom - always visible */}
            {aboutItem && (
                <Box sx={{
                    flexShrink: 0,
                    mt: 'auto',
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: 'inherit',
                }}>
                    <MenuLink item={aboutItem} />
                </Box>
            )}
        </Paper>
    );
}

export default SideMenu;