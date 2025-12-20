import * as React from 'react';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function FileIcon({ fileName, commonProps }: { fileName: string, commonProps: any }) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    let icon = <InsertDriveFileIcon {...commonProps} />;

    switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'svg':
            icon = <ImageIcon {...commonProps} />;
            break;
        case 'pdf':
            icon = <PictureAsPdfIcon {...commonProps} />;
            break;
        case 'doc':
        case 'docx':
        case 'txt':
            icon = <DescriptionIcon {...commonProps} />;
            break;
    }

    return icon;
}
