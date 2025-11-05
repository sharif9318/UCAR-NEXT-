import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React, { useState, useEffect } from "react";
import { light } from "../scss/MaterialTheme";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/client";
import { appWithTranslation } from "next-i18next";
import "../scss/app.scss";
import "../scss/pc/main.scss";
import "../scss/mobile/main.scss";

const App = ({ Component, pageProps }: AppProps) => {
  // @ts-ignore
  const [theme, setTheme] = useState(createTheme(light));
  const client = useApollo(pageProps.initialApolloState);

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default appWithTranslation(App);
