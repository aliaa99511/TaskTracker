import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { ConfigSliceReducer, changeRootUrl, changeToken, changeConfigurationIsCompleted, setUpConfig, resetConfig } from "./slices/config_slice";
import { StepperSliceReducer, changeSteps, changeValidationMode, goToNextStep, goToPreviousStep, resetStepper } from './slices/stepper_slice';
import { commonApi } from './apis/common_api';
import { userApi } from './apis/user_api';
import { employeeApi } from './apis/employee_api';
import { departmentApi } from './apis/department_api';
import { tasksApi } from './apis/tasks_api';
import { setEmployeeInfo, setLoading } from './slices/tasks_config_slice';
import { jobProfileApi } from './apis/jobProfile_api';
import { taskTypeApi } from './apis/taskType_api';

const store = configureStore({
    reducer: {
        config: ConfigSliceReducer,
        stepper: StepperSliceReducer,
        [commonApi.reducerPath]: commonApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [jobProfileApi.reducerPath]: jobProfileApi.reducer,
        [taskTypeApi.reducerPath]: taskTypeApi.reducer,
        [tasksApi.reducerPath]: tasksApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        })
            .concat(commonApi.middleware)
            .concat(userApi.middleware)
            .concat(employeeApi.middleware)
            .concat(departmentApi.middleware)
            .concat(jobProfileApi.middleware)
            .concat(taskTypeApi.middleware)
            .concat(tasksApi.middleware)
    }
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;

export {
    store,

    changeRootUrl,
    changeToken,
    changeConfigurationIsCompleted,
    setUpConfig,
    resetConfig,

    changeSteps,
    changeValidationMode,
    goToNextStep,
    goToPreviousStep,
    resetStepper,

    setEmployeeInfo,
    setLoading,
};

export {
    useFetchListChoiceFieldsQuery,
    useFetchListDataQuery,
    useFetchListDataByFilterQuery,
    useUpdateDocumentPropsMutation,
    useUploadListAttachmentMutation,
    useDeleteListAttachmentMutation,
    useDeleteDocumentLibraryFileMutation
} from "./apis/common_api";

export {
    useFetchUsersQuery,
    useFetchCurrentUserQuery,
    useFetchEmployeeIdQuery,
    useFetchUserGroupsQuery,
    useFetchEmployeeByUserIdQuery,
} from "./apis/user_api";

export {
    useFetchEmployeesQuery,
    useFetchEmployeesWithoutAccountQuery,
    useFetchEmployeeByIdQuery,
    useLazyCheckEmployeeIdQuery,
    useAddEmployeeMutation,
    useUpdateEmployeeMutation,
    useFetchEmployeeByManagerIdQuery
} from "./apis/employee_api";

export {
    useFetchDepartmentsQuery,
    useFetchAllDepartmentsQuery
} from "./apis/department_api";

export {
    useFetchTasksRequestsQuery,
    useFetchTasksRequestsByEmployeeIdQuery,
    useFetchTasksTodayRequestsByManagerIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useUploadTaskAttachmentMutation,
    useFetchTaskAttachmentsQuery,
    useDeleteAttachmentMutation,
} from "./apis/tasks_api"

export {
    useFetchJobProfileQuery
} from './apis/jobProfile_api';

export {
    useFetchTaskTypeWithDepartmentQuery,
    useFetchAllTaskTypeQuery
} from "./apis/taskType_api";
