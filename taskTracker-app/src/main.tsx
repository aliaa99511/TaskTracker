import ReactDOM from "react-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import App from "./App";
const msalConfig = {
    auth: {
        clientId: "842d069f-4f77-4161-ad4a-d9df65e36bab",
        authority: "https://login.microsoftonline.com/9c0eb6b9-85be-4f81-968c-9f4a41f0394e/oauth2/v2.0/authorize",
        redirectUri: "http://localhost:5173",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
};
const msalInstance = new PublicClientApplication(msalConfig);
ReactDOM.render(<MsalProvider instance={msalInstance}>
    <App />
</MsalProvider>, document.getElementById("root"));

