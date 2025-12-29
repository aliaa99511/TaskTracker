


// import * as React from 'react';
// import {
//     Box,
//     Typography,
//     CircularProgress,
//     Alert,
//     AlertTitle,
//     Paper,
//     Button,
//     IconButton
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import {
//     WarningAmber,
//     InfoOutlined,
//     Refresh,
//     Error as ErrorIcon
// } from '@mui/icons-material';

// // Styled components
// export const WrapedContainer = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '100vh',
//     overflowX: 'hidden',
//     overflowY: 'hidden',
//     backgroundColor: theme.palette.background.default,
// }));

// export const StyledMessageContainer = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(4),
//     margin: theme.spacing(4),
//     textAlign: 'center',
//     backgroundColor: theme.palette.background.paper,
//     borderRadius: theme.spacing(2),
//     boxShadow: theme.shadows[3],
//     maxWidth: 600,
//     width: '100%',
// }));

// export const LoadingContainer = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '400px',
//     gap: theme.spacing(2),
// }));

// // Loading Component
// interface LoadingProps {
//     message?: string;
//     subMessage?: string;
//     size?: number;
// }

// export const Loading: React.FC<LoadingProps> = ({
//     message = 'جاري تحميل البيانات...',
//     subMessage = 'يرجى الانتظار',
//     size = 60
// }) => {
//     return (
//         <WrapedContainer>
//             <LoadingContainer>
//                 <CircularProgress size={size} />
//                 {message && (
//                     <Typography variant="h6" color="textSecondary">
//                         {message}
//                     </Typography>
//                 )}
//                 {subMessage && (
//                     <Typography variant="body2" color="textSecondary">
//                         {subMessage}
//                     </Typography>
//                 )}
//             </LoadingContainer>
//         </WrapedContainer>
//     );
// };

// // Error Display Component
// interface ErrorDisplayProps {
//     error?: Error | string | any;
//     title?: string;
//     message?: string;
//     showDetails?: boolean;
//     onRetry?: () => void;
// }

// export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
//     error,
//     title = 'خطأ في تحميل البيانات',
//     message = 'تعذر تحميل البيانات. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.',
//     showDetails = true,
//     onRetry,
// }) => {
//     const errorMessage = error?.toString?.() || error?.message || 'حدث خطأ غير معروف';

//     return (
//         <WrapedContainer>
//             <StyledMessageContainer>
//                 <Alert
//                     severity="error"
//                     sx={{ mb: 2 }}
//                     icon={<ErrorIcon fontSize="large" />}
//                 >
//                     <AlertTitle>{title}</AlertTitle>
//                     {message}
//                 </Alert>

//                 {showDetails && error && (
//                     <Box sx={{
//                         mt: 2,
//                         p: 2,
//                         bgcolor: 'error.light',
//                         borderRadius: 1,
//                         textAlign: 'right',
//                         direction: 'rtl'
//                     }}>
//                         <Typography variant="caption" component="div" sx={{
//                             whiteSpace: 'pre-wrap',
//                             wordBreak: 'break-word',
//                         }}>
//                             <strong>تفاصيل الخطأ:</strong> {errorMessage}
//                         </Typography>
//                     </Box>
//                 )}

//                 {onRetry && (
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={onRetry}
//                         startIcon={<Refresh />}
//                         sx={{ mt: 3 }}
//                     >
//                         حاول مرة أخرى
//                     </Button>
//                 )}
//             </StyledMessageContainer>
//         </WrapedContainer>
//     );
// };

// // Unauthorized Access Component
// interface UnauthorizedAccessProps {
//     currentRole?: string;
//     allowedRoles?: string[];
//     title?: string;
//     message?: string;
//     showDetails?: boolean;
// }

// export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
//     currentRole = 'غير محدد',
//     allowedRoles = ['Employee', 'CEO'],
//     title = 'غير مصرح بالدخول',
//     message = 'ليس لديك صلاحية للوصول إلى هذا التطبيق.',
//     showDetails = true,
// }) => {
//     return (
//         <WrapedContainer>
//             <StyledMessageContainer>
//                 <Alert severity="warning" sx={{ mb: 3 }}>
//                     <AlertTitle>{title}</AlertTitle>
//                     {message}
//                 </Alert>

//                 <Typography variant="h5" gutterBottom sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 1,
//                     justifyContent: 'center',
//                     mb: 3
//                 }}>
//                     <WarningAmber /> الوصول غير مسموح
//                 </Typography>

//                 {showDetails && (
//                     <Box sx={{
//                         textAlign: 'right',
//                         direction: 'rtl',
//                         mt: 2,
//                         p: 2,
//                         bgcolor: 'grey.50',
//                         borderRadius: 1
//                     }}>
//                         <Typography variant="body1" paragraph sx={{ mb: 2 }}>
//                             <strong>معلومات الصلاحية:</strong>
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary" paragraph>
//                             • نوع المستخدم الحالي: <strong style={{ color: 'error.main' }}>{currentRole}</strong>
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                             • الأنواع المسموح بها: <strong style={{ color: 'success.main' }}>{allowedRoles.join(' أو ')}</strong>
//                         </Typography>
//                     </Box>
//                 )}

//                 <Typography variant="body2" sx={{
//                     mt: 3,
//                     color: 'text.secondary',
//                     textAlign: 'right',
//                     direction: 'rtl'
//                 }}>
//                     يرجى التواصل مع مدير النظام أو قسم تكنولوجيا المعلومات للحصول على الصلاحيات المناسبة.
//                 </Typography>
//             </StyledMessageContainer>
//         </WrapedContainer>
//     );
// };

// // No Data Found Component
// interface NoDataFoundProps {
//     title?: string;
//     message?: string;
//     icon?: React.ReactNode;
//     showHelpText?: boolean;
// }

// export const NoDataFound: React.FC<NoDataFoundProps> = ({
//     title = 'بيانات غير متوفرة',
//     message = 'لم يتم العثور على البيانات المطلوبة في النظام.',
//     icon = <InfoOutlined fontSize="large" />,
//     showHelpText = true,
// }) => {
//     return (
//         <WrapedContainer>
//             <StyledMessageContainer>
//                 <Alert severity="info" sx={{ mb: 3 }}>
//                     <AlertTitle>{title}</AlertTitle>
//                     {message}
//                 </Alert>

//                 <Box sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     gap: 2,
//                     mt: 3
//                 }}>
//                     <Box sx={{
//                         fontSize: 48,
//                         color: 'info.main'
//                     }}>
//                         {icon}
//                     </Box>
//                     <Typography variant="h5" gutterBottom>
//                         البيانات غير متاحة
//                     </Typography>

//                     {showHelpText && (
//                         <Typography variant="body2" sx={{
//                             mt: 2,
//                             color: 'text.secondary',
//                             textAlign: 'center'
//                         }}>
//                             يرجى التأكد من تسجيل البيانات في النظام أو التواصل مع المسؤول.
//                         </Typography>
//                     )}
//                 </Box>
//             </StyledMessageContainer>
//         </WrapedContainer>
//     );
// };

// // Status Message Component (Combined)
// interface StatusMessageProps {
//     type: 'loading' | 'error' | 'unauthorized' | 'no-data';
//     loadingProps?: LoadingProps;
//     errorProps?: ErrorDisplayProps;
//     unauthorizedProps?: UnauthorizedAccessProps;
//     noDataProps?: NoDataFoundProps;
// }

// export const StatusMessage: React.FC<StatusMessageProps> = ({
//     type,
//     loadingProps,
//     errorProps,
//     unauthorizedProps,
//     noDataProps,
// }) => {
//     switch (type) {
//         case 'loading':
//             return <Loading {...loadingProps} />;
//         case 'error':
//             return <ErrorDisplay {...errorProps} />;
//         case 'unauthorized':
//             return <UnauthorizedAccess {...unauthorizedProps} />;
//         case 'no-data':
//             return <NoDataFound {...noDataProps} />;
//         default:
//             return null;
//     }
// };

// // Authorization Wrapper Component
// interface AuthorizationWrapperProps {
//     employeeData: any;
//     allowedTypes?: string[];
//     children: React.ReactNode;
//     onUnauthorized?: () => React.ReactNode;
// }

// export const AuthorizationWrapper: React.FC<AuthorizationWrapperProps> = ({
//     employeeData,
//     allowedTypes = ['Employee', 'CEO'],
//     children,
//     onUnauthorized,
// }) => {
//     // Add null check before accessing EmployeeType
//     if (!employeeData || !employeeData.EmployeeType) {
//         return (
//             <NoDataFound
//                 title="بيانات الموظف غير متوفرة"
//                 message="لم يتم العثور على بيانات الموظف المطلوبة للتحقق من الصلاحية."
//             />
//         );
//     }

//     const employeeType = employeeData.EmployeeType;
//     const isAuthorized = allowedTypes.includes(employeeType);

//     if (!isAuthorized) {
//         if (onUnauthorized) {
//             return <>{onUnauthorized()}</>;
//         }

//         return (
//             <UnauthorizedAccess
//                 currentRole={employeeType}
//                 allowedRoles={allowedTypes}
//             />
//         );
//     }

//     return <>{children}</>;
// };

// // Data Loading Wrapper Component
// interface DataLoadingWrapperProps {
//     isLoading: boolean;
//     isError: boolean;
//     data: any;
//     employeeId?: any;
//     onLoading?: () => React.ReactNode;
//     onError?: (error: any) => React.ReactNode;
//     onNoData?: () => React.ReactNode;
//     children: (data: any) => React.ReactNode;
// }

// export const DataLoadingWrapper: React.FC<DataLoadingWrapperProps> = ({
//     isLoading,
//     isError,
//     data,
//     employeeId,
//     onLoading,
//     onError,
//     onNoData,
//     children,
// }) => {
//     if (isLoading) {
//         return onLoading ? <>{onLoading()}</> : <Loading />;
//     }

//     if (isError) {
//         return onError ? <>{onError(isError)}</> : (
//             <ErrorDisplay message="حدث خطأ في تحميل البيانات" />
//         );
//     }

//     // More robust check for valid data
//     // Check if data exists and has required properties
//     if (!data ||
//         !data.EmployeeType ||
//         (employeeId && (!data.id || data.id !== employeeId))) {
//         return onNoData ? <>{onNoData()}</> : (
//             <NoDataFound
//                 message="لم يتم العثور على بيانات الموظف"
//                 title="بيانات الموظف غير متوفرة"
//             />
//         );
//     }

//     return <>{children(data)}</>;
// };
















// latest with refactoring
// import * as React from 'react';
// import { Box, Typography, CircularProgress, Alert, AlertTitle, Paper } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { WarningAmber } from '@mui/icons-material';

// // Styled components
// export const WrapedContainer = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflowX: 'hidden',
//     overflowY: 'hidden',
//     backgroundColor: theme.palette.background.default,
// }));

// export const StyledMessageContainer = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(4),
//     margin: theme.spacing(4),
//     textAlign: 'center',
//     backgroundColor: theme.palette.background.default,
//     borderRadius: theme.spacing(2),
//     boxShadow: theme.shadows[3],
//     maxWidth: 600,
//     width: '100%',
// }));

// export const LoadingContainer = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '400px',
//     gap: theme.spacing(2),
// }));

// // Loading Component
// interface LoadingProps {
//     message?: string;
//     subMessage?: string;
//     size?: number;
// }

// export const Loading: React.FC<LoadingProps> = ({
//     message = 'جاري تحميل البيانات...',
//     subMessage = 'يرجى الانتظار',
//     size = 60
// }) => {
//     return (
//         <WrapedContainer>
//             <LoadingContainer>
//                 <CircularProgress size={size} />
//                 {message && (
//                     <Typography variant="h6" color="textSecondary">
//                         {message}
//                     </Typography>
//                 )}
//                 {subMessage && (
//                     <Typography variant="body2" color="textSecondary">
//                         {subMessage}
//                     </Typography>
//                 )}
//             </LoadingContainer>
//         </WrapedContainer>
//     );
// };

// // Unauthorized Access Component
// interface UnauthorizedAccessProps {
//     currentRole?: string;
//     allowedRoles?: string[];
//     title?: string;
//     message?: string;
//     showDetails?: boolean;
// }

// export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
//     currentRole = 'غير محدد',
//     allowedRoles = ['Employee', 'CEO'],
//     title = 'غير مصرح بالدخول',
//     message = 'ليس لديك صلاحية للوصول إلى هذا التطبيق.',
//     showDetails = true,
// }) => {
//     return (
//         <WrapedContainer>
//             <StyledMessageContainer>
//                 <Alert severity="warning" sx={{ mb: 3 }}>
//                     <AlertTitle>{title}</AlertTitle>
//                     {message}
//                 </Alert>

//                 <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <WarningAmber /> الوصول غير مسموح
//                 </Typography>

//                 {showDetails && (
//                     <Box sx={{ textAlign: 'right', direction: 'rtl', mt: 2 }}>
//                         <Typography variant="body1" paragraph>
//                             معلومات الصلاحية:
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                             • نوع المستخدم الحالي: <strong>{currentRole}</strong>
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                             • الأنواع المسموح بها: <strong>{allowedRoles.join(' أو ')}</strong>
//                         </Typography>
//                     </Box>
//                 )}

//                 <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
//                     يرجى التواصل مع مدير النظام أو قسم تكنولوجيا المعلومات للحصول على الصلاحيات المناسبة.
//                 </Typography>
//             </StyledMessageContainer>
//         </WrapedContainer>
//     );
// };

// // Status Message Component (Combined - Optional wrapper if needed)
// interface StatusMessageProps {
//     type: 'loading' | 'unauthorized';
//     loadingProps?: LoadingProps;
//     unauthorizedProps?: UnauthorizedAccessProps;
// }

// export const StatusMessage: React.FC<StatusMessageProps> = ({
//     type,
//     loadingProps,
//     unauthorizedProps,
// }) => {
//     switch (type) {
//         case 'loading':
//             return <Loading {...loadingProps} />;
//         case 'unauthorized':
//             return <UnauthorizedAccess {...unauthorizedProps} />;
//         default:
//             return null;
//     }
// };

// // Authorization Wrapper Component (Optional - if you need this functionality)
// interface AuthorizationWrapperProps {
//     employeeData: any;
//     allowedTypes?: string[];
//     children: React.ReactNode;
//     onUnauthorized?: () => React.ReactNode;
// }

// export const AuthorizationWrapper: React.FC<AuthorizationWrapperProps> = ({
//     employeeData,
//     allowedTypes = ['Employee', 'CEO'],
//     children,
//     onUnauthorized,
// }) => {
//     const employeeType = employeeData?.EmployeeType;
//     const isAuthorized = allowedTypes.includes(employeeType);

//     if (!isAuthorized) {
//         if (onUnauthorized) {
//             return <>{onUnauthorized()}</>;
//         }

//         return (
//             <UnauthorizedAccess
//                 currentRole={employeeType}
//                 allowedRoles={allowedTypes}
//             />
//         );
//     }

//     return <>{children}</>;
// };

// // Data Loading Wrapper Component (Optional - if you need this functionality)
// interface DataLoadingWrapperProps {
//     isLoading: boolean;
//     data: any;
//     onLoading?: () => React.ReactNode;
//     children: (data: any) => React.ReactNode;
// }

// export const DataLoadingWrapper: React.FC<DataLoadingWrapperProps> = ({
//     isLoading,
//     data,
//     onLoading,
//     children,
// }) => {
//     if (isLoading) {
//         return onLoading ? <>{onLoading()}</> : <Loading />;
//     }

//     return <>{children(data)}</>;
// };










// // //with refactoring
// import * as React from 'react';
// import { Box, Typography, CircularProgress, Alert, AlertTitle, Paper, Button } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { InfoOutlined, WarningAmber } from '@mui/icons-material';

// // Styled components
// export const WrapedContainer = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflowX: 'hidden',
//     overflowY: 'hidden',
//     backgroundColor: theme.palette.background.default,
// }));

// export const StyledMessageContainer = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(4),
//     margin: theme.spacing(4),
//     textAlign: 'center',
//     backgroundColor: theme.palette.background.default,
//     borderRadius: theme.spacing(2),
//     boxShadow: theme.shadows[3],
//     maxWidth: 600,
//     width: '100%',
// }));

// export const LoadingContainer = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '400px',
//     gap: theme.spacing(2),
// }));

// // Loading Component
// interface LoadingProps {
//     message?: string;
//     subMessage?: string;
//     size?: number;
// }

// export const Loading: React.FC<LoadingProps> = ({
//     message = 'جاري تحميل البيانات...',
//     subMessage = 'يرجى الانتظار',
//     size = 60
// }) => {
//     return (
//         <WrapedContainer>
//             <LoadingContainer>
//                 <CircularProgress size={size} />
//                 {message && (
//                     <Typography variant="h6" color="textSecondary">
//                         {message}
//                     </Typography>
//                 )}
//                 {subMessage && (
//                     <Typography variant="body2" color="textSecondary">
//                         {subMessage}
//                     </Typography>
//                 )}
//             </LoadingContainer>
//         </WrapedContainer>
//     );
// };

// // // Error Display Component
// interface ErrorDisplayProps {
//     error?: Error | string | any;
//     title?: string;
//     message?: string;
//     showDetails?: boolean;
//     onRetry?: () => void;
// }

// export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
//     error,
//     title = 'خطأ في تحميل البيانات',
//     message = 'تعذر تحميل البيانات. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.',
//     showDetails = true,
//     onRetry,
// }) => {
//     const errorMessage = error?.toString?.() || error?.message || 'حدث خطأ غير معروف';

//     return (
//         <WrapedContainer>
//             <StyledMessageContainer>
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                     <AlertTitle>{title}</AlertTitle>
//                     {message}
//                 </Alert>

//                 {showDetails && error && (
//                     <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
//                         <Typography variant="caption" component="pre" sx={{
//                             whiteSpace: 'pre-wrap',
//                             wordBreak: 'break-word',
//                             textAlign: 'right',
//                             direction: 'rtl'
//                         }}>
//                             تفاصيل الخطأ: {errorMessage}
//                         </Typography>
//                     </Box>
//                 )}

//                 {onRetry && (
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={onRetry}
//                         sx={{ mt: 3 }}
//                     >
//                         حاول مرة أخرى
//                     </Button>
//                 )}
//             </StyledMessageContainer>
//         </WrapedContainer>
//     );
// };

// // Unauthorized Access Component
// interface UnauthorizedAccessProps {
//     currentRole?: string;
//     allowedRoles?: string[];
//     title?: string;
//     message?: string;
//     showDetails?: boolean;
// }

// export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
//     currentRole = 'غير محدد',
//     allowedRoles = ['Employee', 'CEO'],
//     title = 'غير مصرح بالدخول',
//     message = 'ليس لديك صلاحية للوصول إلى هذا التطبيق.',
//     showDetails = true,
// }) => {
//     return (
//         <WrapedContainer>
//             <StyledMessageContainer>
//                 <Alert severity="warning" sx={{ mb: 3 }}>
//                     <AlertTitle>{title}</AlertTitle>
//                     {message}
//                 </Alert>

//                 <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <WarningAmber /> الوصول غير مسموح
//                 </Typography>

//                 {showDetails && (
//                     <Box sx={{ textAlign: 'right', direction: 'rtl', mt: 2 }}>
//                         <Typography variant="body1" paragraph>
//                             معلومات الصلاحية:
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                             • نوع المستخدم الحالي: <strong>{currentRole}</strong>
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                             • الأنواع المسموح بها: <strong>{allowedRoles.join(' أو ')}</strong>
//                         </Typography>
//                     </Box>
//                 )}

//                 <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
//                     يرجى التواصل مع مدير النظام أو قسم تكنولوجيا المعلومات للحصول على الصلاحيات المناسبة.
//                 </Typography>
//             </StyledMessageContainer>
//         </WrapedContainer>
//     );
// };

// // No Data Found Component
// interface NoDataFoundProps {
//     title?: string;
//     message?: string;
//     icon?: React.ReactNode;
//     showHelpText?: boolean;
// }

// export const NoDataFound: React.FC<NoDataFoundProps> = ({
//     title = 'بيانات غير متوفرة',
//     message = 'لم يتم العثور على البيانات المطلوبة في النظام.',
//     icon = <InfoOutlined fontSize="large" />,
//     showHelpText = true,
// }) => {
//     return (
//         <WrapedContainer>
//             <StyledMessageContainer>
//                 <Alert severity="info" sx={{ mb: 3 }}>
//                     <AlertTitle>{title}</AlertTitle>
//                     {message}
//                 </Alert>

//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//                     <Box sx={{ fontSize: 48 }}>{icon}</Box>
//                     <Typography variant="h5" gutterBottom>
//                         البيانات غير متاحة
//                     </Typography>

//                     {showHelpText && (
//                         <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
//                             يرجى التأكد من تسجيل البيانات في النظام أو التواصل مع المسؤول.
//                         </Typography>
//                     )}
//                 </Box>
//             </StyledMessageContainer>
//         </WrapedContainer>
//     );
// };

// // Status Message Component (Combined)
// interface StatusMessageProps {
//     type: 'loading' | 'error' | 'unauthorized' | 'no-data';
//     loadingProps?: LoadingProps;
//     errorProps?: ErrorDisplayProps;
//     unauthorizedProps?: UnauthorizedAccessProps;
//     noDataProps?: NoDataFoundProps;
// }

// export const StatusMessage: React.FC<StatusMessageProps> = ({
//     type,
//     loadingProps,
//     errorProps,
//     unauthorizedProps,
//     noDataProps,
// }) => {
//     switch (type) {
//         case 'loading':
//             return <Loading {...loadingProps} />;
//         case 'error':
//             return <ErrorDisplay {...errorProps} />;
//         case 'unauthorized':
//             return <UnauthorizedAccess {...unauthorizedProps} />;
//         case 'no-data':
//             return <NoDataFound {...noDataProps} />;
//         default:
//             return null;
//     }
// };

// // Authorization Wrapper Component
// interface AuthorizationWrapperProps {
//     employeeData: any;
//     allowedTypes?: string[];
//     children: React.ReactNode;
//     onUnauthorized?: () => React.ReactNode;
// }

// export const AuthorizationWrapper: React.FC<AuthorizationWrapperProps> = ({
//     employeeData,
//     allowedTypes = ['Employee', 'CEO'],
//     children,
//     onUnauthorized,
// }) => {
//     const employeeType = employeeData?.EmployeeType;
//     const isAuthorized = allowedTypes.includes(employeeType);

//     if (!isAuthorized) {
//         if (onUnauthorized) {
//             return <>{onUnauthorized()}</>;
//         }

//         return (
//             <UnauthorizedAccess
//                 currentRole={employeeType}
//                 allowedRoles={allowedTypes}
//             />
//         );
//     }

//     return <>{children}</>;
// };

// // Data Loading Wrapper Component
// interface DataLoadingWrapperProps {
//     isLoading: boolean;
//     isError: boolean;
//     data: any;
//     employeeId?: any;
//     onLoading?: () => React.ReactNode;
//     onError?: (error: any) => React.ReactNode;
//     onNoData?: () => React.ReactNode;
//     children: (data: any) => React.ReactNode;
// }

// export const DataLoadingWrapper: React.FC<DataLoadingWrapperProps> = ({
//     isLoading,
//     isError,
//     data,
//     employeeId,
//     onLoading,
//     onError,
//     onNoData,
//     children,
// }) => {
//     if (isLoading) {
//         return onLoading ? <>{onLoading()}</> : <Loading />;
//     }

//     if (isError) {
//         return onError ? <>{onError(isError)}</> : <ErrorDisplay />;
//     }

//     if (!data || (employeeId && !data.id)) {
//         return onNoData ? <>{onNoData()}</> : <NoDataFound />;
//     }

//     return <>{children(data)}</>;
// };