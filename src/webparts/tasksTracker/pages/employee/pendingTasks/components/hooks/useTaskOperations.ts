import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { TaskFormData } from '../../../../../components/ITasksTrackerProps';

export const useTaskOperations = (
    employeeId: number | null | undefined,
    refetchTasks: () => void,
    createTaskMutation: any,
    updateTaskMutation: any,
    deleteTaskMutation: any,
    uploadAttachmentMutation: any,
    deleteAttachmentMutation: any
) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskFormData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<{
        id: number;
        title: string;
    } | null>(null);

    const handleCreateClick = useCallback(() => {
        setEditingTask(null);
        setOpenDialog(true);
    }, []);

    const handleEditClick = useCallback((task: any) => {
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
    }, []);

    const handleDeleteClick = useCallback((taskId: number, taskTitle: string) => {
        setTaskToDelete({ id: taskId, title: taskTitle });
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!taskToDelete) return;

        setIsDeleting(true);
        try {
            await deleteTaskMutation(taskToDelete.id).unwrap();
            toast.success('تم حذف المهمة بنجاح');
            refetchTasks();
        } catch (error) {
            toast.error('فشل في حذف المهمة');
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    }, [taskToDelete, deleteTaskMutation, refetchTasks]);

    const handleCancelDelete = useCallback(() => {
        if (!isDeleting) {
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    }, [isDeleting]);

    const uploadAttachments = useCallback(async (taskId: number, files: File[]) => {
        if (!files.length) return;

        const uploadPromises = files.map(async (file) => {
            try {
                await uploadAttachmentMutation({ taskId, file }).unwrap();
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                throw error;
            }
        });

        await Promise.all(uploadPromises);
    }, [uploadAttachmentMutation]);

    const deleteAttachments = useCallback(async (taskId: number, fileNames: string[]) => {
        if (!fileNames.length) return;

        const deletePromises = fileNames.map(async (fileName) => {
            try {
                await deleteAttachmentMutation({ taskId, fileName }).unwrap();
            } catch (error) {
                console.error(`Error deleting ${fileName}:`, error);
            }
        });

        await Promise.all(deletePromises);
    }, [deleteAttachmentMutation]);

    const handleSubmit = useCallback(async (formData: TaskFormData) => {
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

            // Update existing task
            if (formData.Id) {
                await updateTaskMutation({
                    id: formData.Id,
                    data: submissionData
                }).unwrap();

                // Handle file operations in parallel
                const fileOperations = [];

                if (formData.Attachments?.length) {
                    fileOperations.push(uploadAttachments(formData.Id, formData.Attachments));
                }

                if (formData.FilesToDelete?.length) {
                    fileOperations.push(deleteAttachments(formData.Id, formData.FilesToDelete));
                }

                if (fileOperations.length) {
                    await Promise.all(fileOperations);
                }

                toast.success('تم تحديث المهمة بنجاح');
            } else {
                // Create new task
                const response = await createTaskMutation(submissionData).unwrap();
                const taskId = response.d?.Id;

                if (taskId && formData.Attachments?.length) {
                    await uploadAttachments(taskId, formData.Attachments);
                }

                toast.success('تم إنشاء المهمة بنجاح');
            }

            setOpenDialog(false);
            refetchTasks();
        } catch (error: any) {
            console.error('Error saving task:', error);
            const errorMessage = error?.data?.error?.message?.value || 'فشل في حفظ المهمة';
            toast.error(errorMessage);
            throw error;
        }
    }, [
        employeeId,
        createTaskMutation,
        updateTaskMutation,
        uploadAttachments,
        deleteAttachments,
        refetchTasks
    ]);

    return {
        openDialog,
        editingTask,
        deleteDialogOpen,
        isDeleting,
        taskToDelete,
        setOpenDialog,
        handleCreateClick,
        handleEditClick,
        handleDeleteClick,
        handleConfirmDelete,
        handleCancelDelete,
        handleSubmit,
    };
};