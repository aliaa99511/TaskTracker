import React from "react";
import Avatar from "@mui/material/Avatar";
import { useFetchUserPhotoByEmailQuery } from "../../../../../store/apis/user_graph_api";

interface UserAvatarProps {
    name: string;
    userMail?: any;
    size?: number | string;
    fontSize?: number | string;
}

export default function UserAvatar({ name, userMail, size = 26, fontSize = 13 }: UserAvatarProps) {
    const { data: photoUrls } = useFetchUserPhotoByEmailQuery(userMail, {
        skip: !userMail,
    });

    const hasPhoto = photoUrls && photoUrls.length > 0;

    return (
        <Avatar
            alt={name}
            src={hasPhoto ? photoUrls : undefined}
            sx={{
                width: size,
                height: size,
                fontSize: fontSize,
                borderRadius: "50%",
            }}
            title={name}
        >
            {!hasPhoto && name
                ? name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : null}
        </Avatar>

    );
}


