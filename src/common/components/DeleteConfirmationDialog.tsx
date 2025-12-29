import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
} from '@mui/material';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    itemName: string;
    itemType?: string;
    isLoading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    itemName,
    itemType = 'المهمة',
    isLoading = false
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            dir="rtl"
            // maxWidth="sm"
            fullWidth
            sx={{
                display: "flex", justifyContent: "center", alignItems: "center", textAlign: "start",
                '& .MuiDialog-paper': {
                    width: '350px',
                    padding: 3,
                    // maxWidth: '400px'
                }
            }}
        >
            <DialogTitle id="delete-dialog-title">
                <Box gap={1}>
                    {title}
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="delete-dialog-description"
                    sx={{ fontSize: '1rem' }}
                >
                    هل أنت متأكد من حذف {itemType}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{
                justifyContent: 'flex-start',
                padding: 2,
                gap: 1
            }}>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={isLoading}
                >
                    {isLoading ? 'جاري الحذف...' : 'حذف'}
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    disabled={isLoading}
                >
                    إلغاء
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default DeleteConfirmationDialog;