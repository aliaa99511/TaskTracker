import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material';
import NestedList from './nested_list';
import { MenuItem } from '../../webparts/tasksTracker/components/ITasksTrackerProps';

type MenuLinkProps = {
    item: MenuItem;
    isSubLink?: boolean;
} & Omit<ListItemButtonProps, 'children'>;

export default function MenuLink({ item, isSubLink, ...props }: MenuLinkProps) {
    const theme = useTheme();
    const location = useLocation();

    // For items with onClick (like About), don't check active state based on route
    const isActive = item.to ? location.pathname === item.to || location.pathname.startsWith(item.to + '/') : false;

    if (item.children) {
        return <NestedList item={item} />
    }

    const buttonContent = (
        <ListItemButton
            onClick={item.onClick}
            {...props}
            sx={{
                color: theme.palette.text.primary,
                paddingRight: isSubLink ? 4 : 2,
                textAlign: "right",
                borderRadius: 2,
                borderColor: isActive ? theme.palette.primary.main : "transparent",
                margin: "2px 0",
                backgroundColor: isActive ? alpha(theme.palette.primary.main, .1) : "",
                "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, .1),
                },
                "& .MuiTypography-root": {
                    fontWeight: isSubLink ? 300 : 450,
                    fontSize: isSubLink ? ".9em" : "1em"
                }
            }}
        >
            {item.icon}
            <ListItemText primary={item.label} sx={{ color: isActive ? 'primary.main' : 'text.primary' }} />
        </ListItemButton>
    );

    // Only wrap in Link if there's a to prop
    if (item.to) {
        return (
            <Link
                key={item.to}
                to={item.to}
                style={{
                    textDecoration: 'none',
                }}
            >
                {buttonContent}
            </Link>
        );
    }

    // For items without to prop (like About), return just the button
    return buttonContent;
}