export interface BaseComponentProps {
    className?: string;
    style?: React.CSSProperties;
    testId?: string;
}

export interface StatusProps {
    isLoading?: boolean;
    isError?: boolean;
    error?: any;
    isEmpty?: boolean;
}

export interface EmployeeData {
    EmployeeType: string;
    Gender?: string;
    DirectManagerId?: number;
    Department: {
        Id: number;
        Name?: string;
    };
}

export interface AuthorizationConfig {
    allowedTypes: string[];
    redirectOnUnauthorized?: boolean;
    redirectPath?: string;
}