import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Button, Link, Menu, MenuItem, Stack } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import {
  Logout,
  AccountCircleOutlined,
  NotificationsOutlined,
} from "@mui/icons-material";
import { CaretDown } from "phosphor-react";
import { useReactiveVar } from "@apollo/client";
import { useTranslation } from "next-i18next";

import useDeviceDetect from "../../hooks/useDeviceDetect";
import Top from "../Top";
import Footer from "../Footer";
import InteractiveNavbar from "../InteractiveNavbar";
import { getJwtToken, logOut, updateUserInfo } from "../../auth";
import { userVar } from "../../../apollo/store";
import { ThemeMode, ThemeModeContext } from "../../../pages/_app";
import { REACT_APP_API_URL } from "../../config";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const StyledMenu = styled((props: any) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(0.5),
    minWidth: 140,
    maxWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      padding: "8px 12px",
      fontSize: "14px",
      minHeight: "unset",
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
      "&:hover": {
        backgroundColor: "rgba(226, 12, 12, 0.08)",
      },
    },
  },
}));

const PAGE_CONFIG: Record<
  string,
  { title: string; desc: string; bgImage: string; isAuth?: boolean }
> = {
  "/": {
    title: "Home",
    desc: "Browse, filter, and find your perfect car from our curated inventory.",
    bgImage: "/img/banner/header1.svg",
  },
  "/car": {
    title: "Find Your Perfect Car",
    desc: "Browse, filter, and find your perfect car from our curated inventory!",
    bgImage: "/img/banner/header5.svg",
  },
  "/agent": {
    title: "Agents",
    desc: "Home / For Lease",
    bgImage: "/img/banner/agents.webp",
  },
  "/agent/detail": {
    title: "Agent Page",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header2.svg",
  },
  "/mypage": {
    title: "my page",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header1.svg",
  },
  "/community": {
    title: "Community",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header2.svg",
  },
  "/community/detail": {
    title: "Community Detail",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header2.svg",
  },
  "/cs": {
    title: "CS",
    desc: "We are glad to see you again!",
    bgImage: "/img/banner/header2.svg",
  },
  "/account/join": {
    title: "Login/Signup",
    desc: "Authentication Process",
    bgImage: "/img/banner/header2.svg",
    isAuth: true,
  },
  "/member": {
    title: "Member Page",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header1.svg",
  },
};

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const { t } = useTranslation("common");
    const device = useDeviceDetect();
    const user = useReactiveVar(userVar);
    const { mode, setMode } = useContext(ThemeModeContext);

    const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
    const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
    const [lang, setLang] = useState<string>("en");

    const pageConfig = useMemo(() => {
      return PAGE_CONFIG[router.pathname] || PAGE_CONFIG["/"];
    }, [router.pathname]);

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    const handleLangChange = useCallback(
      async (selectedLang: string) => {
        setLang(selectedLang);
        localStorage.setItem("locale", selectedLang);
        setLangAnchor(null);
        await router.push(router.asPath, router.asPath, {
          locale: selectedLang,
        });
      },
      [router]
    );

    const nextThemeMode = useCallback((): ThemeMode => {
      if (mode === "light") return "elevatedDark";
      if (mode === "elevatedDark") return "dark";
      return "light";
    }, [mode]);

    if (device === "mobile") {
      return (
        <>
          <Head>
            <title>UCAR NEXT</title>
            <meta name="title" content="UCAR NEXT" />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id="top">
              <Top />
            </Stack>
            <Stack id="main">
              <Component {...props} />
            </Stack>
            <Stack id="footer">
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    }

    return (
      <>
        <Head>
          <title>UCAR NEXT</title>
          <meta name="title" content="UCAR NEXT" />
        </Head>
        <Stack id="pc-wrap">
          <Stack className="InteractiveNavbar">
            <InteractiveNavbar />
          </Stack>

          <Stack
            className={`header-basic ${pageConfig.isAuth ? "auth" : ""}`}
            style={{
              backgroundImage: `url(${pageConfig.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <Stack id="top">
              <Stack className="nav-container" sx={{ pointerEvents: "auto" }}>
                <Box component="div" className="logo-box">
                  <Link href="/">
                    <img src="/img/logo/ucar_logo (1).svg" alt="UCAR Logo" />
                  </Link>
                </Box>

                <Box component="div" className="user-box">
                  <div
                    className="theme-toggle"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setMode(nextThemeMode())}
                      sx={{
                        color: "#fff",
                        borderColor: "rgba(255,255,255,0.4)",
                        "&:hover": {
                          borderColor: "#fff",
                          background: "rgba(255,255,255,0.08)",
                        },
                        mr: 1,
                      }}
                    >
                      {mode === "light"
                        ? "Light"
                        : mode === "elevatedDark"
                        ? "Elevated"
                        : "Dark"}
                    </Button>
                  </div>

                  {user?._id ? (
                    <>
                      <div
                        className="login-user"
                        onClick={(e) => setLogoutAnchor(e.currentTarget)}
                      >
                        <img
                          src={
                            user?.memberImage
                              ? `${REACT_APP_API_URL}/${user.memberImage}`
                              : "/img/profile/defaultUser.svg"
                          }
                          alt="User Avatar"
                        />
                      </div>

                      <Menu
                        anchorEl={logoutAnchor}
                        open={Boolean(logoutAnchor)}
                        onClose={() => setLogoutAnchor(null)}
                        sx={{ mt: "5px" }}
                      >
                        <MenuItem onClick={() => logOut()}>
                          <Logout
                            fontSize="small"
                            style={{ color: "blue", marginRight: "10px" }}
                          />
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Link href="/account/join">
                      <div className="join-box">
                        <AccountCircleOutlined />
                        <span>
                          {t("Login")} / {t("Register")}
                        </span>
                      </div>
                    </Link>
                  )}

                  <div className="lan-box">
                    {user?._id && (
                      <NotificationsOutlined className="notification-icon" />
                    )}
                    <Button
                      disableRipple
                      className="btn-lang"
                      onClick={(e) => setLangAnchor(e.currentTarget)}
                      endIcon={
                        <CaretDown size={14} color="#616161" weight="fill" />
                      }
                    >
                      <Box component="div" className="flag">
                        <img
                          src={`/img/flag/lang${lang}.png`}
                          alt={`${lang} flag`}
                        />
                      </Box>
                    </Button>

                    <StyledMenu
                      anchorEl={langAnchor}
                      open={Boolean(langAnchor)}
                      onClose={() => setLangAnchor(null)}
                    >
                      <MenuItem onClick={() => handleLangChange("en")}>
                        <img
                          className="img-flag"
                          src="/img/flag/langen.png"
                          alt="English flag"
                        />
                        {t("English")}
                      </MenuItem>
                      <MenuItem onClick={() => handleLangChange("kr")}>
                        <img
                          className="img-flag"
                          src="/img/flag/langkr.png"
                          alt="Korean flag"
                        />
                        {t("Korean")}
                      </MenuItem>
                      <MenuItem onClick={() => handleLangChange("ru")}>
                        <img
                          className="img-flag"
                          src="/img/flag/langru.png"
                          alt="Russian flag"
                        />
                        {t("Russian")}
                      </MenuItem>
                    </StyledMenu>
                  </div>
                </Box>
              </Stack>
            </Stack>

            <Stack className="container">
              <strong>{t(pageConfig.title)}</strong>
              <span>{t(pageConfig.desc)}</span>
            </Stack>
          </Stack>

          <Stack id="main">
            <Component {...props} />
          </Stack>

          <Stack id="footer">
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutBasic;
