import * as React from 'react';
import { List, Paper, useTheme } from '@mui/material';
import MenuLink from './link';

const SideMenu: React.FC<{ navItems: any }> = ({ navItems }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 0,
                width: "100%",
                backgroundColor: theme.palette.background.paper,
                height: "100%",
            }}
        >
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                sx={{
                    position: "sticky",
                    top: 0,
                    p: 0,
                }}
            >
                {navItems.map((item: any, index: number) => <MenuLink key={index} item={item} />)}
            </List>
        </Paper>
    );
}

export default SideMenu;