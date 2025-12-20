import * as React from 'react';
import { useEffect } from "react";
import { createSharePointManagerGroup } from "./manager_team";

export default function CreateGroups() {
    useEffect(() => {
        const createGroups = async () => {
            await createSharePointManagerGroup();
        };

        createGroups();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Creating SharePoint Groups:</h2>
            <p> All groups created successfully automatically.</p>
        </div>
    );
}
