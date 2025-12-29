import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    ThemeProvider,
    CssBaseline,
    Backdrop,
    CircularProgress,
    Grid,
    Paper,
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
                <Grid
                    container
                    spacing={0}
                    sx={{
                        minHeight: "calc(100vh)",
                        direction: lang === "ar" ? "rtl" : "ltr",
                    }}
                >
                    {/* Side Menu */}
                    <Grid
                        item
                        xs={12}
                        md={3}
                        lg={2}
                        sx={{
                            borderLeft: "1px solid #eee",
                            backgroundColor: "#fff",
                        }}
                    >
                        <SideMenu navItems={navItems} />
                    </Grid>

                    {/* Content */}
                    <Grid item xs={12} md={9} lg={10} >
                        <Paper
                            elevation={0}
                            sx={{
                                // p: "1rem 2rem",
                                height: "100%",
                                backgroundColor: "#f6f6f6",
                                minHeight: 'calc(100vh)'
                            }}
                        >
                            {children}
                        </Paper>
                    </Grid>
                </Grid>
            )
            }
        </ThemeProvider >
    );
};

export default Layout;
