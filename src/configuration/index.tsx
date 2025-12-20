import * as React from 'react';
import Stack from '@mui/material/Stack';

import CreateLists from './create_lists';
import CreateGroups from './groups/create_groups';

export default function ConfigurationSteps() {
    const [activeStep] = React.useState(0);
    return (
        <Stack sx={{ width: '100%' }} spacing={4}>
            {activeStep == 0 &&
                <>
                    <CreateLists />
                    <CreateGroups />
                </>
            }
        </Stack>
    );
}