import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { setEmployeeInfo, setLoading, store, useFetchEmployeeByIdQuery, useFetchEmployeeIdQuery, useFetchUserGroupsQuery } from '../../../store';
import { ITasksTrackerProps } from './ITasksTrackerProps';
import SiteConfiguration from '../../../configuration';
import { getNavItemsByRole } from '../../../router/nav_Items';
import Layout from '../../../layout';
import { RedirectRouter } from '../../../router/redirect_router';
import dayjs from 'dayjs';
import 'dayjs/locale/ar'; // For Arabic locale if needed
import PendingTasksLog from '../pages/employee/pendingTasks';
import { ToastContainer } from 'react-toastify';


dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('ar'); // Set Arabic locale

const AppContent: React.FC<ITasksTrackerProps> = ({ siteURL, token, siteTheme }) => {
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
      <ToastContainer />
    </Layout>
  );
};

const TasksTracker: React.FC<ITasksTrackerProps> = (props) => {
  return (
    <Provider store={store}>
      <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AppContent {...props} />
      </HashRouter >
    </Provider>
  );
};

export default TasksTracker;