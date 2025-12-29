import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "842d069f-4f77-4161-ad4a-d9df65e36bab",
        authority:
            "https://login.microsoftonline.com/9c0eb6b9-85be-4f81-968c-9f4a41f0394e",
        redirectUri: window.location.origin + "/",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            logLevel: LogLevel.Info,
        },
    },
};

export const loginRequest = {
    //scopes: ["https://graph.microsoft.com/.default"],
    scopes: ["https://uraniumcorp.sharepoint.com/.default"],
};

export const MicrosoftRequest = {
    // scopes: ["offline_access", "https://graph.microsoft.com/user.read"],
    // scopes: ["User.Read"]
    scopes: ["https://graph.microsoft.com/.default"]


};

