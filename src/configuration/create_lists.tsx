import * as React from 'react';
import { useDispatch } from 'react-redux';
import { sp } from '@pnp/sp';
import { changeConfigurationIsCompleted } from '../store';
import { Box, Button } from '@mui/material';
import { createEmployeeList } from './lists/employee';
import { createDepartmentList } from './lists/department';
import { createJobProfileList } from './lists/job_profile';
import { createTaskTypeList } from './lists/taskType';
import { createTasksList } from './lists/tasks';

const CreateLists: React.FC<{}> = ({ }) => {
    const dispatch = useDispatch();
    const [transactions, setTransactions] = React.useState<string[]>([]);
    const [icCompleted, setIsCompleted] = React.useState(false);

    React.useEffect(() => {
        createListsHandler();
    }, []);

    const handleRedirect = () => {
        dispatch(changeConfigurationIsCompleted(true))
    };

    const createListsHandler = async () => {
        let departmentListInfo: { Id: string };
        try {
            departmentListInfo = await sp.web.lists.getByTitle("Department").select("Id")();
        }
        catch {
            addTransaction("Creating Department List...");
            departmentListInfo = await createDepartmentList();
        }

        let jobProfileListInfo: { Id: string };
        try {
            jobProfileListInfo = await sp.web.lists.getByTitle("JobProfile").select("Id")();
        }
        catch {
            addTransaction("Creating Job Profile List...");
            jobProfileListInfo = await createJobProfileList();
        }

        let taskTypeListInfo: { Id: string, Title: string };
        try {
            taskTypeListInfo = await sp.web.lists.getByTitle("TaskType").select("Id")();
        }
        catch {
            addTransaction("Creating TaskType List...");
            taskTypeListInfo = await createTaskTypeList({
                DepartmentId: departmentListInfo.Id,
            });
        }

        let employeeListInfo: { Id: string, Title: string };
        try {
            employeeListInfo = await sp.web.lists.getByTitle("Employee").select("Id")();
        }
        catch {
            addTransaction("Creating Employee List...");
            employeeListInfo = await createEmployeeList({
                DepartmentId: departmentListInfo.Id,
                JobProfileId: jobProfileListInfo.Id,
            });
        }

        try {
            await sp.web.lists.getByTitle("Tasks").select("Id")();
        }
        catch {
            addTransaction("Creating Tasks Log List...");
            await createTasksList({
                EmployeeId: employeeListInfo.Id,
                DepartmentId: departmentListInfo.Id,
                TaskTypeId: taskTypeListInfo.Id,
            });
        }

        addTransaction("All List created successfully");
        setIsCompleted(true);
    }

    const addTransaction = (newTransaction: string) => {
        setTransactions((prev) => [...prev, newTransaction]);
    };

    return (<Box>
        <h2>List Creation:</h2>
        <ul>
            {transactions.map((transaction, index) => <li key={index}>{transaction}</li>)}
        </ul>
        {icCompleted && <Button color='primary' variant='contained' onClick={handleRedirect}>Let's Start</Button>}
    </Box>
    )
}

export default CreateLists;