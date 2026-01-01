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
    isAboutItem?: boolean; // Add this prop
} & Omit<ListItemButtonProps, 'children'>;

export default function MenuLink({ item, isSubLink, isAboutItem = false, ...props }: MenuLinkProps) {
    const theme = useTheme();
    const location = useLocation();

    // For items with onClick (like About), don't check active state based on route
    const isActive = item.to ? location.pathname === item.to || location.pathname.startsWith(item.to + '/') : false;

    if (item.children) {
        return <NestedList item={item} />
    }

    // Define base styles
    const baseStyles = {
        color: theme.palette.text.primary,
        paddingRight: isSubLink ? 4 : 2,
        textAlign: "right",
        borderRadius: 2,
        margin: "2px 0",
        "& .MuiTypography-root": {
            fontWeight: isSubLink ? 300 : 450,
            fontSize: isSubLink ? ".9em" : "1em"
        }
    };

    // For About item, use special styling
    if (isAboutItem) {
        return (
            <ListItemButton
                onClick={item.onClick}
                {...props}
                sx={{
                    ...baseStyles,
                    color: "#656768", // Fixed color for About item
                    backgroundColor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.grey[300]}`,
                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    marginTop: 2,
                    '&:hover': {
                        backgroundColor: theme.palette.grey[100],
                        borderColor: theme.palette.secondary.light,
                    },
                    "& .MuiTypography-root": {
                        color: "#656768", // Ensure text color is #656768
                        fontWeight: 500,
                    }
                }}
            >
                {item.icon}
                <ListItemText primary={item.label} sx={{ color: "#656768" }} />
            </ListItemButton>
        );
    }

    // Regular items
    const buttonContent = (
        <ListItemButton
            onClick={item.onClick}
            {...props}
            sx={{
                ...baseStyles,
                borderColor: isActive ? theme.palette.primary.main : "transparent",
                backgroundColor: isActive ? alpha(theme.palette.primary.main, .1) : "",
                "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, .1),
                },
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