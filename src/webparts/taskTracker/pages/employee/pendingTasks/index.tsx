import * as React from 'react';
import {
    useFetchEmployeeIdQuery,
    useFetchTasksRequestsByEmployeeIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useUploadTaskAttachmentMutation,
    useDeleteAttachmentMutation,
} from '../../../../../store';
import LoadingOverlay from '../../../../../common/LoadingOverlay';
import { getColumns } from '../../../../../common/CommonColumns';
import NoDataMessage from '../../../../../common/NoDataMessage';
import CustomDataGrid from '../../../../../common/components/table';
import { dataGridStyles } from '../../../../../assets/styles/TableStyles/dataGridStyles.';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskActionMenu from '../../../../../common/TaskActionMenu';
import PendingTasksStats from '../statistics';
import { TaskFormData } from '../../../ITaskTrackerProps';
import TaskFormDialog from '../../../../../common/TaskFormDialog';
import DeleteConfirmationDialog from '../../../../../common/DeleteConfirmationDialog';
import { toast } from 'react-toastify';

const PendingTasksLog: React.FC = () => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: tasks, refetch, isLoading } = useFetchTasksRequestsByEmployeeIdQuery(employeeId as number);

    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [uploadAttachment] = useUploadTaskAttachmentMutation();
    const [deleteAttachment] = useDeleteAttachmentMutation();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState<TaskFormData | null>(null);

    // State for delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [taskToDelete, setTaskToDelete] = React.useState<{
        id: number;
        title: string;
    } | null>(null);

    // Filter tasks to only show those with status "جاري التنفيذ"
    const filteredTasks = React.useMemo(() => {
        if (!tasks) return [];
        return tasks.filter((task: any) => task.Status === "جاري التنفيذ");
    }, [tasks]);

    const hasNoData = !filteredTasks || filteredTasks.length === 0;

    const handleCreateClick = () => {
        setEditingTask(null);
        setOpenDialog(true);
    };

    const handleEditClick = (task: any) => {
        setEditingTask({
            Id: task.Id,
            Title: task.Title,
            Description: task.Description || '',
            StartDate: task.StartDate ? new Date(task.StartDate) : null,
            DueDate: task.DueDate ? new Date(task.DueDate) : null,
            Status: task.Status || '',
            Priority: task.Priority || '',
            TaskTypeId: task.TaskTypeId?.toString() || '',
            DepartmentId: task.DepartmentId?.toString() || '',
            ConcernedEntity: task.ConcernedEntity || '',
            EmployeeId: task.EmployeeId,
            ManagerIDId: task.ManagerIDId,
        });
        setOpenDialog(true);
    };

    const handleDeleteClick = (taskId: number, taskTitle: string) => {
        setTaskToDelete({ id: taskId, title: taskTitle });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;

        setIsDeleting(true);
        try {
            await deleteTask(taskToDelete.id).unwrap();
            toast.success('تم حذف المهمة بنجاح',
                // {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     rtl: true,
                // }
            );
            refetch();
        } catch (error) {
            toast.error('فشل في حذف المهمة',
                // {
                //     position: "top-center",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     rtl: true,
                // }
            );
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        if (!isDeleting) {
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const uploadAttachments = async (taskId: number, files: File[]) => {
        if (!files.length) return;

        for (const file of files) {
            try {
                await uploadAttachment({ taskId, file }).unwrap();
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                throw error;
            }
        }
    };

    const handleSubmit = async (formData: TaskFormData) => {
        try {
            const submissionData = {
                Title: formData.Title,
                Description: formData.Description || '',
                StartDate: formData.StartDate?.toISOString(),
                DueDate: formData.DueDate?.toISOString(),
                Status: formData.Status,
                Priority: formData.Priority,
                TaskTypeId: formData.TaskTypeId ? Number(formData.TaskTypeId) : null,
                DepartmentId: formData.DepartmentId ? Number(formData.DepartmentId) : null,
                ConcernedEntity: formData.ConcernedEntity || '',
                EmployeeId: formData.EmployeeId || employeeId || undefined,
                ManagerIDId: formData.ManagerIDId || undefined,
            };

            // update
            if (formData.Id) {
                await updateTask({
                    id: formData.Id,
                    data: submissionData
                }).unwrap();

                if (formData.Attachments?.length) {
                    await uploadAttachments(formData.Id, formData.Attachments);
                }

                if (formData.FilesToDelete?.length) {
                    for (const fileName of formData.FilesToDelete) {
                        try {
                            await deleteAttachment({ taskId: formData.Id, fileName }).unwrap();
                        } catch (error) {
                            console.error(`Error deleting ${fileName}:`, error);
                        }
                    }
                }

                toast.success('تم تحديث المهمة بنجاح',
                    // {
                    //     position: "top-center",
                    //     autoClose: 3000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    //     rtl: true,
                    // }
                );
            } else {
                const response = await createTask(submissionData).unwrap();
                const taskId = response.d?.Id;

                if (taskId && formData.Attachments?.length) {
                    await uploadAttachments(taskId, formData.Attachments);
                }

                toast.success('تم إنشاء المهمة بنجاح',
                    // {
                    //     position: "top-center",
                    //     autoClose: 3000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    //     rtl: true,
                    // }
                );
            }

            setOpenDialog(false);
            refetch();
        } catch (error: any) {
            console.error('Error saving task:', error);
            const errorMessage = error?.data?.error?.message?.value || 'فشل في حفظ المهمة';
            toast.error(errorMessage,
                //      {
                //     position: "top-center",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     rtl: true,
                // }
            );
            throw error;
        }
    };

    const columns = getColumns(
        "employee",
        "Pending",
        undefined,
    );

    const actionColumn: any = {
        field: 'actions',
        headerName: '',
        flex: 0.3,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
            <TaskActionMenu
                task={params.row}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />
        ),
    };

    const allColumns = [...columns, actionColumn];

    return (
        <>
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5">المهام قيد التنفيذ</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateClick}
                        disabled={isLoading}
                    >
                        مهمة جديدة
                    </Button>
                </Box>

                {isLoading ? (
                    <LoadingOverlay />
                ) : hasNoData ? (
                    <NoDataMessage message="لا توجد مهام قيد التنفيذ" />
                ) : (
                    <CustomDataGrid
                        isLoading={false}
                        rows={filteredTasks}
                        columns={allColumns}
                        getRowHeight={(params) => 'auto'}
                        sx={dataGridStyles}
                        hideQuickFilter={true}
                    />
                )}

                <TaskFormDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSubmit={handleSubmit}
                    initialData={editingTask || undefined}
                    isEdit={!!editingTask}  // {editingTask ? true : false}
                />

                <DeleteConfirmationDialog
                    open={deleteDialogOpen}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="تأكيد حذف المهمة"
                    itemName={taskToDelete?.title || ''}
                    itemType="المهمة"
                    isLoading={isDeleting}
                />
            </Box>
        </>
    );
};

export default PendingTasksLog;