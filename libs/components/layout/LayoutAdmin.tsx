import type { ComponentType, Dispatch, SetStateAction } from "react";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import MenuList from "../admin/AdminMenuList";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { getJwtToken, logOut, updateUserInfo } from "../../auth";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { MemberType } from "../../enums/member.enum";
import Head from "next/head";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

interface AdminComponentProps {
  setSnackbar: Dispatch<
    SetStateAction<{ open: boolean; message: string; severity: string }>
  >;
  setTitle: Dispatch<SetStateAction<string>>;
}

const withAdminLayout = (Component: ComponentType<AdminComponentProps>) => {
  return (props: object) => {
    const router = useRouter();
    const user = useReactiveVar(userVar);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });
    const [title, setTitle] = useState("Admin Panel");
    const [loading, setLoading] = useState(true);

    // Initialize themeMode from localStorage synchronously (prevents flicker)
    const getInitialTheme = () => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("admin_theme_mode");
        if (savedTheme === "light" || savedTheme === "dark") {
          return savedTheme;
        }
      }
      return "dark";
    };
    const [themeMode, setThemeMode] = useState<"light" | "dark">(
      getInitialTheme()
    );

    // Persist theme to localStorage on change
    useEffect(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_theme_mode", themeMode);
      }
    }, [themeMode]);

    /** LIFECYCLES **/
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
      setLoading(false);
    }, []);

    useEffect(() => {
      if (!loading && user.memberType !== MemberType.ADMIN) {
        router.push("/").then();
      }
    }, [loading, user, router]);

    /** HANDLERS **/
    const logoutHandler = () => {
      logOut();
      router.push("/").then();
    };

    const toggleTheme = () =>
      setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));

    const isDesktop = useMediaQuery("(min-width:1024px)");

    const theme = useMemo(
      () =>
        createTheme({
          palette: {
            mode: themeMode,
            background:
              themeMode === "dark"
                ? { default: "#23272f", paper: "#2f2f2f" }
                : { default: "#f4f6fa", paper: "#fff" },
            primary: { main: "#eb6753" },
          },
        }),
      [themeMode]
    );

    if (!user || user?.memberType !== MemberType.ADMIN) return null;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <>
          <Head>
            <title>{title}</title>
          </Head>
          <main
            id="pc-wrap"
            className={`admin ${
              themeMode === "dark" ? "admin-theme-dark" : "admin-theme-light"
            }`}
          >
            <Box className="admin-layout-root">
              {/* Top Navbar */}
              <MenuList
                themeMode={themeMode}
                toggleTheme={toggleTheme}
                logoutHandler={logoutHandler}
              />
              {/* Mobile Drawer for navigation only */}
              {!isDesktop && (
                <Drawer
                  variant="temporary"
                  open={mobileOpen}
                  onClose={() => setMobileOpen(false)}
                  ModalProps={{ keepMounted: true }}
                  className="aside admin-drawer-mobile"
                >
                  <MenuList
                    themeMode={themeMode}
                    toggleTheme={toggleTheme}
                    logoutHandler={logoutHandler}
                  />
                </Drawer>
              )}
              {/* Main content */}
              <Box id="bunker" className="admin-bunker">
                {/*@ts-ignore*/}
                <Component
                  {...props}
                  setSnackbar={setSnackbar}
                  setTitle={setTitle}
                />
              </Box>
            </Box>
            {/* Snackbar for feedback */}
            {snackbar.open && (
              <Box
                className={`admin-snackbar admin-snackbar--${snackbar.severity}`}
                onClick={() => setSnackbar({ ...snackbar, open: false })}
              >
                {snackbar.message}
              </Box>
            )}
          </main>
        </>
      </ThemeProvider>
    );
  };
};

export default withAdminLayout;
