import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import {
  Box,
  Button,
  Link,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
} from "@mui/material";
import { getJwtToken, logOut, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { useTranslation } from "next-i18next";
import { alpha, styled } from "@mui/material/styles";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import InteractiveNavbar from "../InteractiveNavbar";
import { Logout } from "@mui/icons-material";
import { CaretDown } from "phosphor-react";
import { REACT_APP_API_URL } from "../../config";
import { ThemeMode, ThemeModeContext } from "../../../pages/_app";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const { t, i18n } = useTranslation("common");
    const device = useDeviceDetect();
    const [authHeader, setAuthHeader] = useState<boolean>(false);
    const user = useReactiveVar(userVar);
    const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
      null
    );
    const { mode, setMode } = useContext(ThemeModeContext);
    const logoutOpen = Boolean(logoutAnchor);
    const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
    const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
    const drop = Boolean(anchorEl2);
    const [lang, setLang] = useState<string | null>("en");

    const memoizedValues = useMemo(() => {
      let title = "",
        desc = "",
        bgImage = "";

      switch (router.pathname) {
        case "/":
          title = t("Home");
          desc = t("We are glad to see you again!");
          bgImage = "/img/banner/header1.svg";
          break;
        case "/car":
          title = t("Car Search");
          desc = t("We are glad to see you again!");
          bgImage = "/img/banner/header1.svg";
          break;
        case "/agent":
          title = t("Agents");
          desc = t("Home / For Lease");
          bgImage = "/img/banner/agents.webp";
          break;
        case "/agent/detail":
          title = t("Agent Page");
          desc = t("Home / For Lease");
          bgImage = "/img/banner/header2.svg";
          break;
        case "/mypage":
          title = t("my page");
          desc = t("Home / For Lease");
          bgImage = "/img/banner/header1.svg";
          break;
        case "/community":
          title = t("Community");
          desc = t("Home / For Lease");
          bgImage = "/img/banner/header2.svg";
          break;
        case "/community/detail":
          title = t("Community Detail");
          desc = t("Home / For Lease");
          bgImage = "/img/banner/header2.svg";
          break;
        case "/cs":
          title = t("CS");
          desc = t("We are glad to see you again!");
          bgImage = "/img/banner/header2.svg";
          break;
        case "/account/join":
          title = t("Login/Signup");
          desc = t("Authentication Process");
          bgImage = "/img/banner/header2.svg";
          setAuthHeader(true);
          break;
        case "/member":
          title = t("Member Page");
          desc = t("Home / For Lease");
          bgImage = "/img/banner/header1.svg";
          break;
        default:
          break;
      }

      return { title, desc, bgImage };
    }, [router.pathname, t]);

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    const StyledMenu = styled((props: MenuProps) => (
      <Menu
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
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

    const langClick = (e: any) => {
      setAnchorEl2(e.currentTarget);
    };

    const langClose = () => {
      setAnchorEl2(null);
    };

    const langChoice = useCallback(
      async (e: any) => {
        setLang(e.target.id);
        localStorage.setItem("locale", e.target.id);
        setAnchorEl2(null);
        await router.push(router.asPath, router.asPath, {
          locale: e.target.id,
        });
      },
      [router]
    );

    const nextMode = useCallback((): ThemeMode => {
      if (mode === "light") return "elevatedDark";
      if (mode === "elevatedDark") return "dark";
      return "light";
    }, [mode]);

    if (device == "mobile") {
      return (
        <>
          <Head>
            <title>UCAR NEXT</title>
            <meta name={"title"} content={`UCAR NEXT`} />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id={"top"}>
              <Top />
            </Stack>

            <Stack id={"main"}>
              <Component {...props} />
            </Stack>

            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    } else {
      return (
        <>
          <Head>
            <title>UCAR NEXT</title>
            <meta name={"title"} content={`UCAR NEXT`} />
          </Head>
          <Stack id="pc-wrap">
            <Stack className={"InteractiveNavbar"}>
              <InteractiveNavbar />
            </Stack>
            <Stack
              className={`header-basic ${authHeader && "auth"}`}
              style={{
                backgroundImage: `url(${memoizedValues.bgImage})`,
                backgroundSize: "cover",
                boxShadow: "inset 10px 40px 150px 40px rgb(24 22 36)",
              }}
            >
              <Stack id={"top"}>
                <Stack
                  className={"nav-container"}
                  sx={{ pointerEvents: "auto" }}
                >
                  <Box component={"div"} className={"logo-box"}>
                    <Link href={"/"}>
                      <img src="/img/logo/ucar_logo (1).svg" alt="" />
                    </Link>
                  </Box>

                  <Box component={"div"} className={"user-box"}>
                    {/* theme toggle */}
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
                        onClick={() => setMode(nextMode())}
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
                          className={"login-user"}
                          onClick={(event: any) =>
                            setLogoutAnchor(event.currentTarget)
                          }
                        >
                          <img
                            src={
                              user?.memberImage
                                ? `${REACT_APP_API_URL}/${user?.memberImage}`
                                : "/img/profile/defaultUser.svg"
                            }
                            alt=""
                          />
                        </div>

                        <Menu
                          id="basic-menu"
                          anchorEl={logoutAnchor}
                          open={logoutOpen}
                          onClose={() => {
                            setLogoutAnchor(null);
                          }}
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
                      <Link href={"/account/join"}>
                        <div className={"join-box"}>
                          <AccountCircleOutlinedIcon />
                          <span>
                            {t("Login")} / {t("Register")}
                          </span>
                        </div>
                      </Link>
                    )}

                    <div className={"lan-box"}>
                      {user?._id && (
                        <NotificationsOutlinedIcon
                          className={"notification-icon"}
                        />
                      )}
                      <Button
                        disableRipple
                        className="btn-lang"
                        onClick={langClick}
                        endIcon={
                          <CaretDown size={14} color="#616161" weight="fill" />
                        }
                      >
                        <Box component={"div"} className={"flag"}>
                          {lang !== null ? (
                            <img
                              src={`/img/flag/lang${lang}.png`}
                              alt={"usaFlag"}
                            />
                          ) : (
                            <img src={`/img/flag/langen.png`} alt={"usaFlag"} />
                          )}
                        </Box>
                      </Button>

                      <StyledMenu
                        anchorEl={anchorEl2}
                        open={drop}
                        onClose={langClose}
                      >
                        <MenuItem disableRipple onClick={langChoice} id="en">
                          <img
                            className="img-flag"
                            src={"/img/flag/langen.png"}
                            onClick={langChoice}
                            id="en"
                            alt={"usaFlag"}
                          />
                          {t("English")}
                        </MenuItem>
                        <MenuItem disableRipple onClick={langChoice} id="kr">
                          <img
                            className="img-flag"
                            src={"/img/flag/langkr.png"}
                            onClick={langChoice}
                            id="uz"
                            alt={"koreanFlag"}
                          />
                          {t("Korean")}
                        </MenuItem>
                        <MenuItem disableRipple onClick={langChoice} id="ru">
                          <img
                            className="img-flag"
                            src={"/img/flag/langru.png"}
                            onClick={langChoice}
                            id="ru"
                            alt={"russiaFlag"}
                          />
                          {t("Russian")}
                        </MenuItem>
                      </StyledMenu>
                    </div>
                  </Box>
                </Stack>
              </Stack>
              <Stack className={"container"}>
                <strong>{t(memoizedValues.title)}</strong>
                <span>{t(memoizedValues.desc)}</span>
              </Stack>
            </Stack>

            <Stack id={"main"}>
              <Component {...props} />
            </Stack>

            {user?._id && <Chat />}

            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    }
  };
};

export default withLayoutBasic;
