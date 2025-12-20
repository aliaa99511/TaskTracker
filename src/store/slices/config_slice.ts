import { createSlice } from "@reduxjs/toolkit";

const ConfigSlice = createSlice({
    name: "config",
    initialState: {
        rootUrl: "",
        originUrl: "",
        token: null,
        lang: localStorage.getItem("lang") || "ar",
        configurationIsCompleted: true
    },
    reducers: {
        changeRootUrl(state, action) {
            state.rootUrl = action.payload;
            state.originUrl = new URL(action.payload).origin || "";
        },
        changeSiteLanguage(state) {
            state.lang = localStorage.getItem("lang") || "ar";
        },
        changeToken(state, action) {
            state.token = action.payload;
        },
        changeConfigurationIsCompleted(state, action) {
            state.configurationIsCompleted = action.payload;
        },
        setUpConfig(state, action) {
            state.rootUrl = action.payload.rootUrl;
            state.originUrl = new URL(action.payload.rootUrl).origin || "";
            state.token = action.payload.token;
            state.lang = action.payload.lang;
        },
        resetConfig(state) {
            state.rootUrl = "";
            state.originUrl = "";
            state.token = null;
            state.lang = localStorage.getItem("lang") || "ar";
            state.configurationIsCompleted = false;
        },
    }
})

export const {
    changeRootUrl,
    changeSiteLanguage,
    changeToken,
    changeConfigurationIsCompleted,
    setUpConfig,
    resetConfig
} = ConfigSlice.actions;

export const ConfigSliceReducer = ConfigSlice.reducer;