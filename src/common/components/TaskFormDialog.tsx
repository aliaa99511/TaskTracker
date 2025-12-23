import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Stack,
    Chip,
    Grid,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { rtlTheme, rtlCache } from '../../rtlTheme';
import { useFetchAllTaskTypeQuery, useFetchEmployeeIdQuery, useFetchTaskAttachmentsQuery } from '../../store';
import { GetStatusOptions } from '../../configuration/options_field/tasks_status';
import { GetPriorityOptions } from '../../configuration/options_field/tasks_priority';
import dayjs from 'dayjs';

// Import CommonInput component
import CommonInput from './CommonInput';
import { TaskFormData, TaskFormDialogProps } from '../../webparts/tasksTracker/components/ITasksTrackerProps';

// Validation schema
const createTaskSchema = yup.object({
    Title: yup.string().required('عنوان المهمة مطلوب'),
    Description: yup.string(),
    StartDate: yup.date().nullable(),
    DueDate: yup.date().nullable(),
    Status: yup.string().required('الحالة مطلوبة'),
    Priority: yup.string().required('الأولوية مطلوبة'),
    TaskTypeId: yup.string().required('نوع المهمة مطلوب'),
    DepartmentId: yup.string(),
    ConcernedEntity: yup.string(),
});

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    isEdit = false,
}) => {
    const { data: employeeId } = useFetchEmployeeIdQuery();
    const { data: taskTypeData } = useFetchAllTaskTypeQuery();

    // Fetch existing attachments for editing
    const { data: existingAttachments } = useFetchTaskAttachmentsQuery(initialData?.Id || 0, {
        skip: !initialData?.Id,
    });

    const statusOptions = GetStatusOptions();
    const priorityOptions = GetPriorityOptions();

    const {
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: yupResolver(createTaskSchema),
        defaultValues: {
            Title: '',
            Description: '',
            StartDate: null,
            DueDate: null,
            Status: 'لم يبدأ بعد',
            Priority: 'متوسطة',
            TaskTypeId: '',
            DepartmentId: '',
            ConcernedEntity: '',
            EmployeeId: employeeId as number,
        }
    });

    const [files, setFiles] = React.useState<File[]>([]);
    const [filesToDelete, setFilesToDelete] = React.useState<string[]>([]);

    // Set initial data when dialog opens
    React.useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                StartDate: initialData.StartDate ? new Date(initialData.StartDate) : null,
                DueDate: initialData.DueDate ? new Date(initialData.DueDate) : null,
                TaskTypeId: initialData.TaskTypeId?.toString() || '',
                DepartmentId: initialData.DepartmentId?.toString() || '',
            });
        } else {
            reset({
                Title: '',
                Description: '',
                StartDate: null,
                DueDate: null,
                Status: 'لم يبدأ بعد',
                Priority: 'متوسطة',
                TaskTypeId: '',
                DepartmentId: '',
                ConcernedEntity: '',
                EmployeeId: employeeId as number,
            });
        }
        setFiles([]);
        setFilesToDelete([]);
    }, [initialData, employeeId, reset, open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && !isSubmitting) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeNewFile = (index: number) => {
        if (!isSubmitting) {
            setFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const removeExistingFile = (fileName: string) => {
        if (!isSubmitting) {
            setFilesToDelete(prev => [...prev, fileName]);
        }
    };

    const downloadFile = (fileName: string, serverRelativeUrl: string) => {
        const fullUrl = `https://uraniumcorp.sharepoint.com${serverRelativeUrl}`;
        window.open(fullUrl, '_blank');
    };

    const onSubmitHandler = async (data: TaskFormData) => {
        try {
            const submitData: TaskFormData = {
                ...data,
                TaskTypeId: data.TaskTypeId ? Number(data.TaskTypeId) : '',
                DepartmentId: data.DepartmentId ? Number(data.DepartmentId) : '',
                Attachments: files,
                FilesToDelete: filesToDelete,
            };

            await onSubmit(submitData);

            // Reset and close are handled by parent component
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            setFiles([]);
            setFilesToDelete([]);
            onClose();
        }
    };

    // Watch form values
    const title = watch('Title');
    const taskTypeId = watch('TaskTypeId');
    const startDate = watch('StartDate');
    const dueDate = watch('DueDate');
    const status = watch('Status');
    const priority = watch('Priority');
    const concernedEntity = watch('ConcernedEntity');
    const description = watch('Description');

    // Prepare options for selects
    const taskTypeOptions = taskTypeData?.map(taskType => ({
        value: taskType.Id.toString(),
        label: taskType.Title
    })) || [];

    const statusOptionsArray = statusOptions.map(status => ({
        value: status,
        label: status
    }));

    const priorityOptionsArray = priorityOptions.map(priority => ({
        value: priority,
        label: priority
    }));

    return (
        <CacheProvider value={rtlCache}>
            <ThemeProvider theme={rtlTheme}>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    dir="rtl"
                    PaperProps={{
                        sx: {
                            width: "650px",
                            maxWidth: "90%",
                            borderRadius: "20px",
                            p: 1,
                        },
                    }}
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography fontWeight={700} fontSize={18} sx={{ mb: 1.5 }}>
                                {isEdit ? 'تعديل المهمة' : 'إنشاء مهمة جديدة'}
                            </Typography>

                            {/* <IconButton onClick={handleClose} disabled={isSubmitting}>
                                <CloseIcon />
                            </IconButton> */}
                        </Box>
                    </DialogTitle>

                    <DialogContent >
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmitHandler)}
                            sx={{ mt: 1 }}
                        >
                            <Grid container spacing={2}>
                                {/* Title Field */}
                                <Grid item xs={12}>
                                    <CommonInput
                                        type="text"
                                        name="Title"
                                        value={title || ''}
                                        onChange={(value) => setValue('Title', value)}
                                        label="عنوان المهمة"
                                        error={!!errors.Title}
                                        helperText={errors.Title?.message}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Description Field */}
                                <Grid item xs={12}>
                                    <CommonInput
                                        type="textarea"
                                        name="Description"
                                        value={description || ''}
                                        onChange={(value) => setValue('Description', value)}
                                        label="الوصف"
                                        rows={3}
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Start Date Field */}
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="تاريخ البدء"
                                            value={startDate ? dayjs(startDate) : null}
                                            onChange={(date) =>
                                                setValue('StartDate', date ? date.toDate() : null)
                                            }
                                            disabled={isSubmitting}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    error={!!errors.StartDate}
                                                    helperText={errors.StartDate?.message}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: "8px",
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                {/* Due Date Field */}
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="تاريخ التسليم"
                                            minDate={startDate ? dayjs(startDate) : undefined}
                                            value={dueDate ? dayjs(dueDate) : null}
                                            onChange={(date) =>
                                                setValue('DueDate', date ? date.toDate() : null)
                                            }
                                            disabled={isSubmitting}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    error={!!errors.DueDate}
                                                    helperText={errors.DueDate?.message}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: "8px",
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                {/* Status Field - Select */}
                                <Grid item xs={12} sm={6}>
                                    <CommonInput
                                        type="select"
                                        name="Status"
                                        value={status || ''}
                                        onChange={(value) => setValue('Status', value)}
                                        label="الحالة"
                                        options={statusOptionsArray}
                                        error={!!errors.Status}
                                        helperText={errors.Status?.message}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Priority Field - Select */}
                                <Grid item xs={12} sm={6}>
                                    <CommonInput
                                        type="select"
                                        name="Priority"
                                        value={priority || ''}
                                        onChange={(value) => setValue('Priority', value)}
                                        label="الأولوية"
                                        options={priorityOptionsArray}
                                        error={!!errors.Priority}
                                        helperText={errors.Priority?.message}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Task Type Field - Select */}
                                <Grid item xs={12} sm={6}>
                                    <CommonInput
                                        type="select"
                                        name="TaskTypeId"
                                        value={taskTypeId || ''}
                                        onChange={(value) => setValue('TaskTypeId', value)}
                                        label="نوع المهمة"
                                        options={taskTypeOptions}
                                        error={!!errors.TaskTypeId}
                                        helperText={errors.TaskTypeId?.message}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Concerned Entity Field */}
                                <Grid item xs={12} sm={6}>
                                    <CommonInput
                                        type="text"
                                        name="ConcernedEntity"
                                        value={concernedEntity || ''}
                                        onChange={(value) => setValue('ConcernedEntity', value)}
                                        label="الجهة المسؤولة"
                                        disabled={isSubmitting}
                                    />
                                </Grid>

                                {/* Display existing attachments */}
                                {isEdit && existingAttachments && existingAttachments.length > 0 && (
                                    <Grid item xs={12}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography variant="body2" color="text.secondary">
                                                الملفات المرفقة حالياً:
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {existingAttachments.map((file: any, index: number) => {
                                                    const isMarkedForDeletion = filesToDelete.includes(file.FileName);
                                                    return (
                                                        <Chip
                                                            key={index}
                                                            label={file.FileName}
                                                            onDelete={() => removeExistingFile(file.FileName)}
                                                            onClick={() => downloadFile(file.FileName, file.ServerRelativeUrl)}
                                                            deleteIcon={<DeleteIcon />}
                                                            icon={<DownloadIcon />}
                                                            variant="outlined"
                                                            sx={{
                                                                mb: 1,
                                                                textDecoration: isMarkedForDeletion ? 'line-through' : 'none',
                                                                opacity: isMarkedForDeletion ? 0.5 : 1,
                                                                '&:hover': {
                                                                    cursor: 'pointer',
                                                                },
                                                            }}
                                                            disabled={isSubmitting}
                                                            color={isMarkedForDeletion ? "error" : "default"}
                                                        />
                                                    );
                                                })}
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                )}

                                {/* Display selected new files */}
                                {files.length > 0 && (
                                    <Grid item xs={12}>
                                        <Stack direction="column" spacing={1}>
                                            <Typography variant="body2" color="text.secondary">
                                                ملفات جديدة:
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {files.map((file, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={file.name}
                                                        onDelete={() => removeNewFile(index)}
                                                        deleteIcon={<DeleteIcon />}
                                                        variant="outlined"
                                                        sx={{ mb: 1 }}
                                                        disabled={isSubmitting}
                                                    />
                                                ))}
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                )}

                                {/* File Upload Area */}
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            border: "2px dashed #E0E0E0",
                                            borderRadius: "14px",
                                            p: 4,
                                            textAlign: "center",
                                            cursor: "pointer",
                                            backgroundColor: "#FCFCFC",
                                            '&:hover': {
                                                backgroundColor: !isSubmitting ? '#F5F5F5' : '#FCFCFC',
                                            },
                                            opacity: isSubmitting ? 0.5 : 1,
                                        }}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            multiple
                                            onChange={handleFileChange}
                                            hidden
                                            disabled={isSubmitting}
                                        />

                                        <label htmlFor="file-upload" style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                            <Box>
                                                <Typography fontSize={30}>
                                                    <AttachFileIcon />
                                                </Typography>
                                                <Typography fontWeight={600}>
                                                    اسحب الملفات وأفلتها هنا أو{" "}
                                                    <Box component="span" color="primary.main">
                                                        اختر رفع الملفات
                                                    </Box>
                                                </Typography>
                                            </Box>
                                        </label>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={handleClose}
                            sx={{
                                borderRadius: "12px",
                                px: 4,
                                color: "#000",
                                "&:hover": {
                                    backgroundColor: "gray.200",
                                },
                            }}
                            disabled={isSubmitting}
                        >
                            إلغاء
                        </Button>

                        <Button
                            type="submit"
                            onClick={handleSubmit(onSubmitHandler)}
                            variant="contained"
                            disabled={isSubmitting || !title || !taskTypeId}
                            sx={{
                                borderRadius: "12px",
                                px: 4,
                                backgroundColor: "primary.main",
                                "&:hover": {
                                    backgroundColor: "primary.main",
                                },
                            }}
                        >
                            {isSubmitting ? 'جاري الحفظ...' : (isEdit ? 'تحديث' : 'إنشاء')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </CacheProvider>
    );
};

export default TaskFormDialog;
