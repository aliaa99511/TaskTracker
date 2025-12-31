import * as React from 'react';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { MenuItem } from '../../webparts/tasksTracker/components/ITasksTrackerProps';
import MenuLink from './link';

interface NestedListProps {
    item: MenuItem;
}

export default function NestedList({ item }: NestedListProps) {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {item.children?.map((child, index) => (
                        <MenuLink key={index} item={{ ...child, icon: child.icon || item.icon }} isSubLink />
                    ))}
                </List>
            </Collapse>
        </>
    );
}