import * as React from 'react';
import type { ITaskTrackerProps } from './ITaskTrackerProps';
import { ToastContainer } from 'react-toastify';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../layout';
import { RedirectRouter } from '../../router/redirect_router';
import { getNavItemsByRole } from '../../router/nav_Items';
import { setEmployeeInfo, setLoading, store, useFetchEmployeeByIdQuery, useFetchEmployeeIdQuery, useFetchUserGroupsQuery } from '../../store';
import SiteConfiguration from '../../configuration';
import PendingTasksLog from './pages/employee/pendingTasks';

// Initialize dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/ar'; // For Arabic locale if needed
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('ar'); // Set Arabic locale

const AppContent: React.FC<ITaskTrackerProps> = ({ siteURL, token, siteTheme }) => {
  const dispatch = useDispatch();
  const [role, setRole] = React.useState<string[]>([]);

  const { data: groups } = useFetchUserGroupsQuery();
  const { data: employeeId, isLoading: isEmployeeIdLoading } = useFetchEmployeeIdQuery();
  const { data: employeeDataInfo, isLoading: isEmployeeDataLoading } = useFetchEmployeeByIdQuery(employeeId as number, {
    skip: !employeeId,
  });

  React.useEffect(() => {
    if (!groups) return;

    const roles: string[] = [];

    if (groups.some((g: any) => g.Title === "Manager Team Members")) {
      roles.push("manager");
    }

    if (groups.some((g: any) => g.Title === "HR Team Members")) {
      roles.push("hr");
    }

    if (roles.length === 0) {
      roles.push("employee");
    }

    setRole(roles);
  }, [groups]);

  React.useEffect(() => {
    if (isEmployeeIdLoading || isEmployeeDataLoading) {
      dispatch(setLoading({ key: "employee", value: true }));
    } else if (employeeDataInfo) {
      dispatch(
        setEmployeeInfo({
          gender: employeeDataInfo?.Gender ?? null,
          employeeId: employeeId ? employeeId : null,
          directManagerId: employeeDataInfo.DirectManagerId ?? null,
          departmentId: employeeDataInfo.Department.Id ?? null,
        })
      );
      dispatch(setLoading({ key: "employee", value: false }));
    }

  }, [employeeDataInfo, isEmployeeIdLoading, isEmployeeDataLoading]);

  const navItems = getNavItemsByRole(role);

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
        <Route index element={<RedirectRouter />} />
        <Route path="/myPendingTasksLog" element={<PendingTasksLog />} />

        {role.includes("manager") && (
          <>
            {/* <Route path="/teamAttendanceLog" element={<ManagerAttendanceLog />} /> */}
            {/* <Route path="/teamMissingRequestsLog" element={<ManagerMissingRequestsLog />} /> */}
          </>
        )}
      </Routes>
      {/* <ToastContainer /> */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ direction: 'rtl' }}
      />
    </Layout>
  );
};

const TaskTracker: React.FC<ITaskTrackerProps> = (props) => {
  return (
    <Provider store={store}>
      <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AppContent {...props} />
      </HashRouter >
    </Provider>
  );
};

export default TaskTracker;