import { alpha } from "@mui/material";
// import * as moment from "moment";
import dayjs from 'dayjs';
import 'dayjs/locale/ar'; // If you need Arabic locale
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
// Set locale if needed
dayjs.locale('ar');

export const getStatusColor = (status: string) => {
    switch (status) {
        // switch (status.toLowerCase()) {
        case 'لم يبدأ بعد':
            return {
                color: '#6E6E6E',
                backgroundColor: '#EBEBEB'
            };
        case 'تم البدأ':
            return {
                color: '#3498DB',
                backgroundColor: '#E8F4FD'
            };
        case 'جاري التنفيذ':
            return {
                color: '#774DD2',
                backgroundColor: '#EFE8FE'
            };
        case 'جاري المراجعة':
            return {
                color: '#F39C12',
                backgroundColor: '#FEF5E7'
            };
        case "تم الانتهاء":
            return {
                color: '#27AE60',
                backgroundColor: '#E7F7EF'
            };
        case 'لم يتم الحل':
            return {
                color: '#E74C3C',
                backgroundColor: '#FDEDEC'
            };
        default:
            return {
                color: '#E3F2E1',
                backgroundColor: '#E84B5A'
            };
    }
};

export const getPriorityColor = (priority: string): { backgroundColor: string, color: string } => {
    switch (priority) {
        case "متوسطة":
            return {
                backgroundColor: '#DCFCE7',
                color: '#166534'
            };
        case "عالية":
            return {
                backgroundColor: '#FFEDD5EE',
                color: '#9A3412'
            };
        case "حرجة":
            return {
                backgroundColor: '#FEE2E2EE',
                color: '#991B1B'
            };
        default:
            return {
                backgroundColor: '#DCFCE7',
                color: '#166534'
            };
    }
};

export const formatDate = (value?: string) => {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('ar-EG');
};

export const safePercent = (value: number, total: number) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
};


function hashStringToInt(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function stringToDistinctColor(name: string, isDarkTheme: boolean): string {
    const hash = hashStringToInt(name);
    const hue = hash % 360;
    const saturation = 65;
    const lightness = isDarkTheme ? 45 : 60;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getContrastTextColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000' : '#fff';
}

export function stringAvatar(name: string, isDarkTheme: boolean) {
    const names = name.toLocaleUpperCase().split(" ");
    const backgroundColor = stringToDistinctColor(name, isDarkTheme);
    const textColor = getContrastTextColor(backgroundColor);

    return {
        sx: {
            bgcolor: backgroundColor,
            color: textColor,
            fontSize: "14px",
            width: "34px",
            height: "34px",
        },
        children: `${names[0]?.[0] || ""}${names[1]?.[0] || ""}`,
    };
}

export function getDropDownOptionsFromList(list: any[], lang: string) {
    return list.map(item => {
        const label = lang == "ar" ? item.Ar_Title : item.Title;
        if (label) {
            return {
                id: item.Id,
                label,
                ...(item.Color && { color: item.Color })
            }
        }
    }).filter(item => item != undefined)
}

export function getDropDownOptionFromData(value: any, lang: string) {
    if (value) {
        const label = lang == "ar" ? value.Ar_Title : value.Title;
        if (label) {
            return {
                id: value.Id,
                label,
                ...(value.Color && { color: value.Color })
            }
        }
    }
    return null
}

export function getLookUpFieldTitle(value: any, lang: string) {
    if (value) {
        const label = lang == "ar" ? value.Ar_Title : value.Title;
        return label;
    }
    return ""
}

export function getSelectQuery(lookups: any) {
    return [
        "*",
        ...Object.keys(lookups).reduce((acc: string[], field) => {
            const subFields = lookups[field as keyof typeof lookups];
            const mapped = subFields.map((sub: any) => `${field}/${sub}`);
            return acc.concat(mapped);
        }, [])
    ].join(",")
}


export function filterNonEmptyObjects(data: any) {
    const getValues = (obj: Record<string, any>) => Object.keys(obj).map(key => obj[key]);
    const FilteredArray = data.filter((obj: any) =>
        getValues(obj).some((val: any) => val !== null && val !== "" && val.length > 0)
    );
    return FilteredArray;
}

export function sanitizeNumber(val: any) {
    return val === "" || val === null ? null : Number(val);
}

export function getOriginURL(link: string): string | null {
    try {
        const new_url = new URL(link);
        return new_url.origin;
    } catch (err) {
        return null;
    }
}

export function getFormattedDate(date: Date | string | null) {
    if (!date) return '';

    return dayjs(date).format('LL'); // 'LL' format: MMMM D, YYYY
}

export function getRelativeDateFromNow(date: Date | string | null) {
    if (!date) return '';

    return dayjs(date).fromNow();
}

export function getRowStyle(Status: any) {
    let styles: Record<string, any> = {};

    Status.forEach((status: any) => {
        const className = `${status.Title}_row`.replace(/\s+/g, '_');
        styles[`& .${className}`] = {
            backgroundColor: alpha(status.Color, .08),
            '&:hover': {
                backgroundColor: alpha(status.Color, .1),
            },
        };
    });

    return styles;
}

export function getFileExtension(filename: string): string | null {
    const parts = filename.split('.');
    if (parts.length > 1 && parts[parts.length - 1]) {
        return parts.pop()?.toLowerCase() || null;
    }
    return null;
}

export function formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);

    return `${value.toFixed(2)} ${sizes[i]}`;
}

export const formatArabicLongDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
export const getAttachmentUrl = (serverRelativeUrl: string): string => {
    return `https://uraniumcorp.sharepoint.com${serverRelativeUrl}`;
};

export const downloadFile = (fileName: string, serverRelativeUrl: string): void => {
    const fullUrl = getAttachmentUrl(serverRelativeUrl);
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const openFile = (serverRelativeUrl: string): void => {
    const fullUrl = getAttachmentUrl(serverRelativeUrl);
    window.open(fullUrl, '_blank');
};

export const hasRealNotes = (html: string | null) => {
    if (!html) return false;
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text.length > 0;
};