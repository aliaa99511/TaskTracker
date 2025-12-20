import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from '@mui/material/styles';
import { Backdrop, CircularProgress, CssBaseline, Grid2, Paper } from "@mui/material";
import { sp } from "@pnp/sp";

import GetSiteTheme from "../theme";
import SideMenu from "./side_menu";

import { changeConfigurationIsCompleted, RootState, setUpConfig } from "../store";
import { SPSetUp } from "../utils/db";

interface LayoutProps {
    siteURL: string;
    token: string | null;
    children: React.ReactNode;
    siteTheme: object;
    navItems: any;
    configurationComponent: any;
    configurationListName: string;
}

const Layout: React.FC<LayoutProps> = ({ siteURL, token, siteTheme, navItems, configurationComponent, configurationListName, children }) => {
    const dispatch = useDispatch();
    const [ready, setReady] = React.useState(false);
    const { configurationIsCompleted, lang } = useSelector((state: RootState) => state.config);
    const theme = React.useMemo(() => GetSiteTheme(siteTheme), [siteTheme]);

    const checkIfConfigured = async () => {
        SPSetUp({ token, siteURL });
        const exists = await sp.web.lists.getByTitle(configurationListName).select("Title")().catch(() => null);
        dispatch(changeConfigurationIsCompleted(exists));
        setReady(true);
    }

    React.useEffect(() => {
        if (!document.getElementById("cairo-font")) {
            const link = document.createElement('link');
            link.id = "cairo-font";
            link.rel = 'stylesheet';
            link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap";
            document.head.appendChild(link);
        }

        if (!document.getElementById("roboto-font")) {
            const link = document.createElement('link');
            link.id = "roboto-font";
            link.rel = 'stylesheet';
            link.href = "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap";
            document.head.appendChild(link);
        }
    }, [])

    React.useEffect(() => {
        dispatch(setUpConfig({ rootUrl: siteURL, token, lang }));
        checkIfConfigured();
    }, [dispatch, siteURL, token]);

    React.useEffect(() => {
        if (lang) {
            if (lang === "ar") {
                document.documentElement.lang = "ar";
                document.documentElement.dir = "rtl";
            } else {
                document.documentElement.lang = "en";
                document.documentElement.dir = "ltr";
            }
        }
    }, [lang])


    if (!ready) return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {!configurationIsCompleted && configurationComponent}
            {configurationIsCompleted &&
                <Grid2
                    container
                    spacing={0}
                    sx={{ direction: "rtl", minHeight: "calc(100vh - 180px)" }}
                >
                    <Grid2
                        size={{ xs: 12, md: 12, lg: 2.5, xl: 2 }}
                        sx={{
                            borderRight: "1px solid #eee",
                            backgroundColor: "white",
                        }}
                    >
                        <SideMenu navItems={navItems} />
                    </Grid2>
                    <Grid2 size={{ md: 12, lg: 9.5, xl: 10 }}>
                        <Paper elevation={0} sx={{ padding: "1rem 2rem", height: "100%" }}>
                            {children}
                        </Paper>
                    </Grid2>
                </Grid2>
            }
        </ThemeProvider>
    );
};

export default Layout;