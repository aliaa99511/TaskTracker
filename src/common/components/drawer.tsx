import * as React from 'react';
import { alpha, Box, DialogContent, Drawer, IconButton, Typography, useTheme } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function CustomDrawer({ open, setOpen, title, children }: { open: boolean; setOpen: Function; title: string; children: React.ReactElement }) {
    const theme = useTheme();
    const closeDrawer = () => {
        setOpen(false);
    };

    return (
        <Drawer
            anchor={'right'}
            open={open}
            onClose={closeDrawer}
            ModalProps={{
                BackdropProps: {
                    style: { pointerEvents: 'none' },
                    onClick: (e) => {
                        e.stopPropagation();
                    }
                },
                disableEscapeKeyDown: true
            }}
        >
            <Box
                sx={{
                    position: "stickey",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: ".75rem 2rem",
                    borderBottom: "1px solid",
                    borderColor: alpha(theme.palette.text.primary, .1),
                }}
            >
                <Typography variant='body1'>{title}</Typography>

                <IconButton onClick={closeDrawer}>
                    <CloseOutlinedIcon />
                </IconButton>

            </Box>

            <DialogContent sx={{ p: 4 }}>
                {children}
            </DialogContent>

        </Drawer>
    )
}