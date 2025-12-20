import * as React from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from "@azure/msal-browser";
import defaultTheme from '../../src/theme/defaultTheme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskTracker from '../../src/webparts/taskTracker/TaskTracker';

const loginRequest = {
    scopes: ["https://uraniumcorp.sharepoint.com/.default"]
};

const App: React.FC<any> = ({ }) => {
    const { instance, accounts, inProgress } = useMsal();
    const [token, setToken] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (inProgress === InteractionStatus.None && accounts.length > 0) {
            const account = accounts[0];
            instance.acquireTokenSilent({
                account: account,
                ...loginRequest,
            }).then((response) => {
                setToken(response.accessToken);
                setIsLoading(false);
            }).catch((error) => {
                console.log("❌ Token not in cache or expired:", error);
                setIsLoading(false);
            });
        }
        if (inProgress === InteractionStatus.None && accounts.length == 0) {
            setIsLoading(false);
        }
    }, [inProgress, accounts, instance]);

    const fetchToken = async () => {
        // Prevent multiple simultaneous interactions
        if (inProgress !== InteractionStatus.None) {
            return;
        }

        try {
            setIsLoading(true);
            await instance.loginPopup(loginRequest);
        } catch (error) {
            console.error("Token acquisition error:", error);
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <div>Checking token...</div>}
            {!isLoading && token == "" && (
                <button onClick={fetchToken} disabled={inProgress !== InteractionStatus.None}>
                    {inProgress !== InteractionStatus.None ? "Logging in..." : "Log In"}
                </button>
            )}
            {!isLoading && token !== "" &&
                <>
                    <TaskTracker
                        siteURL="https://uraniumcorp.sharepoint.com/sites/TasksTrackers"
                        token={token}
                        user={{}}
                        siteTheme={defaultTheme}
                    />
                    <ToastContainer />
                </>
            }
        </>
    )
};

export default App;