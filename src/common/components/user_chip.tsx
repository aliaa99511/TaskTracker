import * as React from 'react';
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";

import { stringAvatar } from '../utils/helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function UserChip({ userName, extraInfo, userImage }: { userName: string; extraInfo?: string; userImage?: string; }) {
    const theme = useTheme();
    const { originUrl } = useSelector((state: RootState) => state.config)

    if (!userName) { return null; }

    return (
        <Box
            sx={{
                display: "inline-flex",
                flexDirection: "row",
                alignItems: "center",
                width: "fit-content",
                height: "100%",
                borderRadius: "50px",
                textAlign: theme.direction == "rtl" ? "right" : "left",
            }}
        >
            {userImage && <Avatar sx={{ width: 34, height: 34 }} src={originUrl + userImage} />}
            {!userImage && <Avatar sizes='20' {...stringAvatar(userName, theme.palette.mode == "dark")} />}

            <Stack sx={{
                margin: "0 5px",
                [theme.direction == "rtl" ? "paddingLeft" : "paddingRight"]: ".5rem",
            }}
            >
                <Typography variant='body1' fontSize={"1em"}>{userName}</Typography>
                {extraInfo && <Typography variant='body2'>{extraInfo}</Typography>}
            </Stack>
        </Box>
    );
}