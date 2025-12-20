import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import MenuLink from './link';

type MenuItem = {
    label: string;
    to: string;
    children: {
        label: string;
        to: string;
    }[];
};

type MenuLinkProps = {
    item: MenuItem;
};

export default function NestedList({ item }: MenuLinkProps) {
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton onClick={handleClick} sx={{
                "& .MuiTypography-root": {
                    textAlign: "right",
                    fontWeight: 450,
                    fontSize: "1em"
                }
            }}>
                <ListItemText primary={item.label} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {item.children.map((sub_link: any, index) => <MenuLink
                        key={index}
                        item={sub_link}
                        isSubLink={true}
                    />)}
                </List>
            </Collapse>
        </>
    );
}
