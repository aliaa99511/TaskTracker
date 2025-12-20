

import * as React from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export const RedirectRouter: React.FC = ({ }) => {
    const navigate = useNavigate();

    useEffect(() => {
        let path = "/myPendingTasksLog";

        navigate(path);

    }, [navigate]);

    return <CircularProgress />;
};


