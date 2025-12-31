import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    ThemeProvider,
    CssBaseline,
    Backdrop,
    CircularProgress,
    Paper,
    Box,
} from "@mui/material";
import { sp } from "@pnp/sp";

import GetSiteTheme from "../theme";
import SideMenu from "./side_menu";

import {
    changeConfigurationIsCompleted,
    RootState,
    setUpConfig,
} from "../store";
import { SPSetUp } from "../utils/db";

interface LayoutProps {
    siteURL: string;
    token: string | null;
    children: React.ReactNode;
    siteTheme: object;
    navItems: any;
    configurationComponent: React.ReactNode;
    configurationListName: string;
}

const Layout: React.FC<LayoutProps> = ({
    siteURL,
    token,
    siteTheme,
    navItems,
    configurationComponent,
    configurationListName,
    children,
}) => {
    const dispatch = useDispatch();
    const [ready, setReady] = React.useState(false);

    const { configurationIsCompleted, lang } = useSelector(
        (state: RootState) => state.config
    );

    const theme = React.useMemo(
        () => GetSiteTheme(siteTheme),
        [siteTheme]
    );

    const checkIfConfigured = async () => {
        SPSetUp({ token, siteURL });

        const exists = await sp.web.lists
            .getByTitle(configurationListName)
            .select("Title")()
            .catch(() => null);

        dispatch(changeConfigurationIsCompleted(!!exists));
        setReady(true);
    };

    /* Load fonts once */
    React.useEffect(() => {
        if (!document.getElementById("cairo-font")) {
            const link = document.createElement("link");
            link.id = "cairo-font";
            link.rel = "stylesheet";
            link.href =
                "https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap";
            document.head.appendChild(link);
        }

        if (!document.getElementById("roboto-font")) {
            const link = document.createElement("link");
            link.id = "roboto-font";
            link.rel = "stylesheet";
            link.href =
                "https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap";
            document.head.appendChild(link);
        }
    }, []);

    React.useEffect(() => {
        dispatch(setUpConfig({ rootUrl: siteURL, token, lang }));
        checkIfConfigured();
    }, [dispatch, siteURL, token]);

    React.useEffect(() => {
        if (!lang) return;

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }, [lang]);

    /* Loading state */
    if (!ready) {
        return (
            <Backdrop
                sx={(theme) => ({
                    color: "#fff",
                    zIndex: theme.zIndex.drawer + 1,
                })}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {!configurationIsCompleted && configurationComponent}

            {configurationIsCompleted && (
                <Box
                    sx={{
                        display: 'flex',
                        height: '100vh',
                        direction: lang === "ar" ? "rtl" : "ltr",
                        backgroundColor: '#f6f6f6',
                        overflow: 'hidden', // Prevent double scrollbars
                    }}
                >
                    {/* Side Menu - Fixed width, scrollable */}
                    <Box
                        sx={{
                            width: { xs: '100%', md: 250, lg: 280 },
                            flexShrink: 0,
                            backgroundColor: '#fff',
                            borderLeft: '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%', // Take full height of parent
                        }}
                    >
                        <SideMenu navItems={navItems} />
                    </Box>

                    {/* Main Content - Takes remaining space, scrollable */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            overflow: 'auto', // Make content scrollable
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                backgroundColor: '#f6f6f6',
                                minHeight: '100%', // Ensure it fills the space
                            }}
                        >
                            {children}
                        </Paper>
                    </Box>
                </Box>
            )}
        </ThemeProvider>
    );
};

export default Layout;