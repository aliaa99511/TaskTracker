import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EmployeeInfo = {
    gender: string | null;
    type: string | null;
    employeeId: number | null;
    directManagerId: number | null,
    departmentId: number | null,
};

type TasksConfigState = {
    currentLeave: any;
    employeeInfo: EmployeeInfo;
    errors: Record<string, string>;
    loadingPage: Record<string, boolean>;
};

const initialState: TasksConfigState = {
    currentLeave: {},
    employeeInfo: {
        gender: null,
        type: null,
        employeeId: null,
        directManagerId: null,
        departmentId: null,
    },
    errors: {},
    loadingPage: {},

};

const tasksConfigSlice = createSlice({
    name: "tasksConfig",
    initialState,
    reducers: {
        setEmployeeInfo: (state, action: PayloadAction<EmployeeInfo>) => {
            state.employeeInfo = action.payload;
        },
        addError: (state, action: PayloadAction<{ field: string; message: string }>) => {
            state.errors[action.payload.field] = action.payload.message;
        },
        removeError: (state, action: PayloadAction<string>) => {
            delete state.errors[action.payload];
        },
        clearErrors: (state) => {
            state.errors = {};
        },
        setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
            state.loadingPage[action.payload.key] = action.payload.value;
        },
    },
});

export const {
    setEmployeeInfo,
    addError,
    removeError,
    clearErrors,
    setLoading
} = tasksConfigSlice.actions;

export const tasksConfigSliceReducer = tasksConfigSlice.reducer;

