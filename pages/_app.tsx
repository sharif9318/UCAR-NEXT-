import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useCallback,
} from "react";
import { light, dark, elevatedDark } from "../scss/MaterialTheme";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/client";
import { appWithTranslation } from "next-i18next";
import "../scss/app.scss";
import "../scss/pc/main.scss";
import "../scss/mobile/main.scss";

export type ThemeMode = "light" | "dark" | "elevatedDark";
export const ThemeModeContext = createContext<{
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}>({ mode: "light", setMode: () => {} });

const App = ({ Component, pageProps }: AppProps) => {
  const client = useApollo(pageProps.initialApolloState);

  const [mode, setMode] = useState<ThemeMode>("light");
  const muiTheme = useMemo(() => {
    switch (mode) {
      case "dark":
        return createTheme(dark as any);
      case "elevatedDark":
        return createTheme(elevatedDark as any);
      case "light":
      default:
        return createTheme(light as any);
    }
  }, [mode]);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? (localStorage.getItem("app_theme_mode") as ThemeMode | null)
        : null;
    if (saved) setMode(saved);
  }, []);

  const setModeAndPersist = useCallback((m: ThemeMode) => {
    setMode(m);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_theme_mode", m);
      document.documentElement.setAttribute("data-theme", m);
    }
  }, []);

  // initialize data-theme attribute for CSS hooks
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }
  }, [mode]);

  // Suppress Apollo Client deprecation warnings in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const originalError = console.error;
      console.error = (...args) => {
        const errorMessage = args[0]?.toString() || "";
        // Suppress known Apollo Client internal warnings
        if (
          errorMessage.includes("go.apollo.dev/c/err") ||
          errorMessage.includes("canonizeResults") ||
          errorMessage.includes('message":17') ||
          errorMessage.includes('message":78') ||
          errorMessage.includes('message":104')
        ) {
          return;
        }
        originalError.apply(console, args);
      };
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <ThemeModeContext.Provider value={{ mode, setMode: setModeAndPersist }}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </ApolloProvider>
  );
};

export default appWithTranslation(App);
