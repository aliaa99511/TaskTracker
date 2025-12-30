import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
  setEmployeeInfo,
  setLoading,
  store,
  useFetchEmployeeByIdQuery,
  useFetchEmployeeIdQuery
} from '../../../store';
import { ITasksTrackerProps } from './ITasksTrackerProps';
import SiteConfiguration from '../../../configuration';
import { getNavItemsByRole } from '../../../router/nav_Items';
import Layout from '../../../layout';
import { RedirectRouter } from '../../../router/redirect_router';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import EmployeePendingTasksLog from '../pages/employee/pendingTasks';
import { ToastContainer } from 'react-toastify';
import EmployeeTasksLog from '../pages/employee/tasksLog';
import ManagerRecentTasksLog from '../pages/manager/recentTasksLog';
import ManagerTasksLog from '../pages/manager/tasksLog';
import { Box, Typography, Alert, AlertTitle, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('ar');

// Styled components
const WrapedContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const StyledMessageContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  maxWidth: '600px',
  width: '100%',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  gap: theme.spacing(2),
}));

const AppContent: React.FC<ITasksTrackerProps> = ({ siteURL, token, siteTheme }) => {
  const dispatch = useDispatch();
  const [isConfigSet, setIsConfigSet] = React.useState(false);

  // إعداد التكوين أولاً
  React.useEffect(() => {
    if (siteURL) {
      // Dispatch لتحديث rootUrl و token في store
      dispatch({ type: 'config/changeRootUrl', payload: siteURL });
      if (token) {
        dispatch({ type: 'config/changeToken', payload: token });
      }
      setIsConfigSet(true);
    }
  }, [siteURL, token, dispatch]);

  // استخدام الاستعلامات فقط بعد إعداد التكوين
  const {
    data: employeeId,
    isLoading: isEmployeeIdLoading,
    error: employeeIdError,
    refetch: refetchEmployeeId
  } = useFetchEmployeeIdQuery(undefined, {
    skip: !isConfigSet || !siteURL,
  });

  const {
    data: employeeDataInfo,
    isLoading: isEmployeeDataLoading,
    error: employeeDataError,
    refetch: refetchEmployeeData
  } = useFetchEmployeeByIdQuery(employeeId as number, {
    skip: !isConfigSet || !employeeId,
  });

  // تحديث معلومات الموظف في store
  React.useEffect(() => {
    if (isEmployeeIdLoading || isEmployeeDataLoading) {
      dispatch(setLoading({ key: "employee", value: true }));
    } else if (employeeDataInfo) {
      dispatch(
        setEmployeeInfo({
          gender: employeeDataInfo?.Gender ?? null,
          type: employeeDataInfo?.EmployeeType ?? null,
          employeeId: employeeId ? employeeId : null,
          directManagerId: employeeDataInfo.DirectManagerId ?? null,
          departmentId: employeeDataInfo.Department?.Id ?? null,
        })
      );
      dispatch(setLoading({ key: "employee", value: false }));
    }
  }, [employeeDataInfo, isEmployeeIdLoading, isEmployeeDataLoading, dispatch, employeeId]);

  // إعادة المحاولة عند وجود أخطاء
  React.useEffect(() => {
    if (employeeIdError || employeeDataError) {
      console.error('API Error:', { employeeIdError, employeeDataError });

      // إعادة المحاولة بعد 3 ثواني
      const timer = setTimeout(() => {
        if (employeeIdError) refetchEmployeeId();
        if (employeeDataError && employeeId) refetchEmployeeData();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [employeeIdError, employeeDataError, refetchEmployeeId, refetchEmployeeData, employeeId]);

  // حالة التحميل
  if (!isConfigSet || isEmployeeIdLoading || isEmployeeDataLoading) {
    return (
      <WrapedContainer>
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6" color="textSecondary">
            جاري تحميل بيانات المستخدم...
          </Typography>
        </LoadingContainer>
      </WrapedContainer>
    );
  }

  // حالة الخطأ
  if (employeeIdError || employeeDataError) {
    return (
      <WrapedContainer>
        <StyledMessageContainer>
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>خطأ في الاتصال</AlertTitle>
            تعذر الاتصال بخادم SharePoint. يرجى التحقق من:
            <ul style={{ textAlign: 'right', marginRight: '20px' }}>
              <li>اتصال الشبكة</li>
              <li>صلاحيات المستخدم</li>
              <li>عنوان الموقع ({siteURL})</li>
            </ul>
          </Alert>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            تفاصيل الخطأ: {employeeIdError?.toString() || employeeDataError?.toString()}
          </Typography>
        </StyledMessageContainer>
      </WrapedContainer>
    );
  }

  // التحقق من الصلاحيات
  if (!employeeDataInfo) {
    return (
      <WrapedContainer>
        <StyledMessageContainer>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>بيانات غير متوفرة</AlertTitle>
            لم يتم العثور على بيانات الموظف المرتبطة بحسابك.
          </Alert>
        </StyledMessageContainer>
      </WrapedContainer>
    );
  }

  const employeeType = employeeDataInfo.EmployeeType;
  const isAuthorized = employeeType === "Employee" || employeeType === "CEO";

  if (!isAuthorized) {
    return (
      <WrapedContainer>
        <StyledMessageContainer>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>غير مصرح بالدخول</AlertTitle>
            نوع الموظف ({employeeType}) غير مصرح له بالدخول.
          </Alert>
        </StyledMessageContainer>
      </WrapedContainer>
    );
  }

  // الحصول على عناصر التنقل وعرض التطبيق
  const navItems = getNavItemsByRole([], employeeDataInfo);

  return (
    <Layout
      siteURL={siteURL}
      token={token || null}
      siteTheme={siteTheme}
      navItems={navItems}
      configurationComponent={<SiteConfiguration />}
      configurationListName={"Tasks"}
    >
      <Routes>
        {employeeType === "Employee" && (
          <>
            <Route index element={<RedirectRouter />} />
            <Route path="/myPendingTasksLog" element={<EmployeePendingTasksLog />} />
            <Route path="/myTasksLog" element={<EmployeeTasksLog />} />
          </>
        )}

        {employeeType === "CEO" && (
          <>
            <Route index element={<RedirectRouter />} />
            <Route path="/managerRecentTasksLog" element={<ManagerRecentTasksLog />} />
            <Route path="/managerTasksLog" element={<ManagerTasksLog />} />
          </>
        )}
      </Routes>
      <ToastContainer />
    </Layout>
  );
};

const TasksTracker: React.FC<ITasksTrackerProps> = (props) => {
  return (
    <Provider store={store}>
      <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AppContent {...props} />
      </HashRouter>
    </Provider>
  );
};

export default TasksTracker;
