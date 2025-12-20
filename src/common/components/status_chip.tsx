import * as React from 'react';
import { Box, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

type Status = {
    id: string;
    label: string;
    color: string;
};

type Props = {
    status: Status;
};

export default function StatusChip({ status }: Props) {

    return (
        <Box display={"flex"} alignItems={"center"} height={"100%"}>
            <Chip
                size='medium'
                sx={{
                    backgroundColor: alpha(status.color, 0.15),
                    color: status.color,
                    fontWeight: 500,
                    padding: "5px 1rem",
                    display: "flex",
                    alignItems: "center",
                    "& .MuiChip-label": {
                        padding: "0 5px",
                        fontSize: ".8rem",
                        lineHeight: 2
                    }
                }}
                icon={
                    <FiberManualRecordIcon
                        sx={{
                            fontSize: "10px",
                            fill: status.color,
                            margin: "0 !important"
                        }}
                    />
                }
                label={status.label}
            />
        </Box>
    );
}