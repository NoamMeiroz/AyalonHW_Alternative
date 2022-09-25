import React from "react";

import WebSocketProvider from "./webSocket";
import StatusSnackBar from "./common/StatusSnackBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { makeStyles } from "@mui/styles";
import { heIL } from "@mui/material/locale";

import "./App.css";
import HeaderBar from "./HeaderBar";
import RTL from "./rtl";
import SideBar from "./SideBar";

const theme = createTheme(
  {
    direction: "rtl", // Both here and <body dir="rtl">
    pallete: {
      text: {
        color: "#242736",
      },
    },
    typography: {
      color: "#242736",
      fontFamily: ['"Segoe UI, Tahoma, Geneva, Verdana, sans-serif"'].join(","),
    },
    overrides: {
      // Style sheet name ⚛️
      MuiTypography: {
        h6: {
          fontWeight: "400",
          color: "#0092EE",
          fontSize: "2vmax",
        },
      },
      MuiAppBar: {
        colorPrimary: {
          color: "#242736",
        },
      },
      MuiButton: {
        root: {
          color: "#242736",
        },
        textPrimary: {
          color: "#242736",
        },
      },
      MuiPaper: {
        root: {
          // Some CSS
          color: "#242736",
        },
      },
      MuiAutocomplete: {
        input: {
          fontSize: "1vmax",
        },
      },
    },
  },
  heIL
);

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  info: {
    paddingBottom: 14,
  },
});

function App({ children }) {
  const classes = useStyles();

  return (
    <RTL>
      <ThemeProvider theme={theme}>
        <SCThemeProvider theme={theme}>
          <WebSocketProvider>
            <div className={classes.root} dir="rtl">
              <HeaderBar />
              <main>{children}</main>
              <SideBar className={classes.drawer} />
            </div>
            <StatusSnackBar />
          </WebSocketProvider>
        </SCThemeProvider>
      </ThemeProvider>
    </RTL>
  );
}

export default App;
