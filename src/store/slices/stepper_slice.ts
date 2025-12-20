import { createSlice } from "@reduxjs/toolkit";

const StepperSlice = createSlice({
    name: "stepper",
    initialState: {
        steps: [],
        activeStep: 0,
        validationMode: "onSubmit",
    },
    reducers: {
        changeSteps(state, action) {
            state.steps = action.payload;
        },
        changeValidationMode(state, action) {
            state.validationMode = action.payload;
        },
        goToNextStep(state) {
            state.activeStep = state.activeStep + 1;
        },
        goToPreviousStep(state) {
            state.activeStep = state.activeStep - 1;
        },
        resetStepper(state) {
            // state.steps = [];
            state.activeStep = 0;
            state.validationMode = "onSubmit"
        },
    }
})

export const {
    changeSteps,
    changeValidationMode,
    goToNextStep,
    goToPreviousStep,
    resetStepper
} = StepperSlice.actions;

export const StepperSliceReducer = StepperSlice.reducer;