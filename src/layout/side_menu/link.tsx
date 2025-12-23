import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import NestedList from './nested_list';
import { alpha, useTheme } from '@mui/material';

type MenuItem = {
    label: string;
    icon: React.ReactNode;
    to: string;
    children: {
        label: string;
        to: string;
    }[];
};

type MenuLinkProps = {
    item: MenuItem;
    isSubLink?: boolean;
} & ListItemButtonProps;

export default function MenuLink({ item, isSubLink }: MenuLinkProps) {
    const theme = useTheme();
    const location = useLocation();
    const isActive = location.pathname.indexOf(item.to) != -1;

    if (item.children) {
        return <NestedList item={item} />
    }

    return (
        <Link
            key={item.to}
            to={item.to}
            style={{
                textDecoration: 'none',
            }}
        >
            <ListItemButton
                sx={{
                    color: theme.palette.text.primary,
                    // borderRight: `3px solid`,
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
                <ListItemText primary={item.label} sx={{ color: 'primary.main' }} />
            </ListItemButton>
        </Link>
    );
}
