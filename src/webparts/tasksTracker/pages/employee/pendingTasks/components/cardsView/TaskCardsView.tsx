import * as React from 'react';
import { Grid } from '@mui/material';
import TaskCard from './TaskCard';

const TaskCardsView = ({ tasks, onEdit, onDelete }: any) => (
    <Grid container spacing={2}>
        {tasks.map((task: any) => (
            <Grid item xs={12} md={4} key={task.ID}>
                <TaskCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </Grid>
        ))}
    </Grid>
);

export default TaskCardsView;
