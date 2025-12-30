import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Chip,
    Grid,
    Paper,
    Stack,
} from '@mui/material';
import {
    Close as CloseIcon,
    Description as DescriptionIcon,
    AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { formatArabicLongDate, formatDate, getPriorityColor, openFile } from '../../../../../utils/helpers';

interface TaskDetailsModalProps {
    open: boolean;
    onClose: () => void;
    task: any | null;
}

interface DetailItem {
    label: string;
    value: React.ReactNode;
    renderCondition?: boolean;
}

const TaskDetailsDialog: React.FC<TaskDetailsModalProps> = ({ open, onClose, task }) => {
    if (!task) return null;

    // Common function to get task details data
    const getTaskDetails = (): DetailItem[] => [
        {
            label: 'عنوان المهمة:',
            value: task.Title || 'غير محدد',
        },
        {
            label: 'الموظف المسؤول:',
            value: task.Employee?.Title || 'غير محدد',
        },
        {
            label: 'القسم:',
            value: task.Department?.Title || 'غير محدد',
        },
        {
            label: 'الجهة المعنية:',
            value: task.ConcernedEntity || 'غير محدد',
        },
        {
            label: 'نوع المهمة:',
            value: task.TaskType?.Title || 'غير محدد',
        },
        {
            label: 'تاريخ البدء:',
            value: formatArabicLongDate(task.StartDate) || 'غير محدد',
        },
        {
            label: 'تاريخ التسليم:',
            value: formatArabicLongDate(task.DueDate) || 'غير محدد',
        },
        {
            label: 'تاريخ الإنشاء:',
            value: formatDate(task.Created),
        },
        {
            label: 'الأولوية:',
            value: (
                <Chip
                    label={task.Priority}
                    size="small"
                    sx={{
                        ...getPriorityColor(task.Priority),
                    }}
                />
            ),
        },
        {
            label: 'الحالة:',
            value: (
                <Chip
                    label={task.Status}
                    size="small"
                    color={
                        task.Status === 'تم الانتهاء'
                            ? 'success'
                            : task.Status === 'جاري التنفيذ'
                                ? 'warning'
                                : 'default'
                    }
                />
            ),
        },
        {
            label: 'الوصف:',
            value: task.Description || 'لا يوجد وصف',
            renderCondition: !!task.Description,
        },
    ];

    // Render detail item component
    const renderDetailItem = (item: DetailItem, index: number) => (
        <Box key={index} sx={{ display: 'flex', alignItems: "center", gap: 1 }}>
            <Typography variant="body1" fontWeight="medium" color="text.secondary" gutterBottom>
                {item.label}
            </Typography>
            {typeof item.value === 'string' ? (
                <Typography variant="body2">
                    {item.value}
                </Typography>
            ) : (
                item.value
            )}
        </Box>
    );

    const taskDetails = getTaskDetails();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '60vh',
                },
            }}
        >
            <DialogTitle sx={{ m: 0, p: 1, textAlign: "center" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        تفاصيل المهمة
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0.5, pt: 1, overflowX: "hidden" }}>
                <Grid container spacing={1}>
                    {/* Left Column - Basic Info */}
                    <Grid item xs={12} md={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Stack spacing={1}>
                                {taskDetails.map((item, index) =>
                                    item.renderCondition !== false && renderDetailItem(item, index)
                                )}
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Attachments Section - Full Width */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                المرفقات
                            </Typography>

                            {task.AttachmentFiles?.results?.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                                    {task.AttachmentFiles.results.map((attachment: any, index: number) => (
                                        <Chip
                                            key={index}
                                            label={attachment.FileName}
                                            onClick={() => openFile(attachment.ServerRelativeUrl)}
                                            icon={<AttachFileIcon />}
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                mb: 1,
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    backgroundColor: 'action.hover',
                                                },
                                            }}
                                            color="default"
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Box
                                    sx={{
                                        py: 4,
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                    }}
                                >
                                    <DescriptionIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
                                    <Typography>لا توجد مرفقات لهذه المهمة</Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetailsDialog;