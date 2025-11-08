import { useReactiveVar } from "@apollo/client";
import {
  Box,
  Link,
  Button,
  Stack,
  Menu,
  MenuItem,
  MenuProps,
  Typography,
} from "@mui/material";
import { userVar } from "../../apollo/store";
import { useEffect, useState, useContext, useCallback } from "react";
import { useTranslation } from "next-i18next";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Logout } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useRouter } from "next/router";
import { sweetConfirmAlert, sweetTopSmallSuccessAlert } from "./../sweetAlert";
import { ThemeModeContext, ThemeMode } from "../../pages/_app";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { styled, alpha } from "@mui/material/styles";
import { REACT_APP_API_URL } from "../config";
import React from "react";
import { getJwtToken, logOut, updateUserInfo } from "../auth";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { CaretDown } from "phosphor-react";

const StyledWrapper = styled("div")<{ $themeMode?: ThemeMode }>`
  .glass-radio-group {
    --bg: ${({ $themeMode }) =>
      $themeMode === "dark"
        ? "rgba(30, 30, 40, 0.5)"
        : $themeMode === "elevatedDark"
        ? "rgba(40, 40, 60, 0.3)"
        : "rgba(255, 255, 255, 0.06)"};
    --text: ${({ $themeMode }) =>
      $themeMode === "dark"
        ? "#e0e6f0"
        : $themeMode === "elevatedDark"
        ? "#ffe066"
        : "#222"};

    display: flex;
    position: relative;
    background: var(--bg);
    color: var(--text);
    border-radius: 1rem;
    backdrop-filter: blur(12px);
    box-shadow: inset 1px 1px 4px rgba(255, 255, 255, 0.2),
      inset -1px -1px 6px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    width: fit-content;
  }

  .glass-radio-group input {
    display: none;
  }

  .glass-radio-group label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    font-size: 14px;
    padding: 0.8rem 1.6rem;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--text);
    position: relative;
    z-index: 2;
    transition: color 0.3s ease-in-out;
  }

  .glass-radio-group label:hover {
    color: white;
    background: red;
  }

  .glass-radio-group input:checked + label {
    color: #fff;
  }

  .glass-glider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: calc(100% / 3);
    border-radius: 1rem;
    z-index: 1;
    transition: transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56),
      background 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  }

  /* Light */
  #light:checked ~ .glass-glider {
    transform: translateX(0%);
    background: linear-gradient(135deg, #c0c0c055, #242121ff);
    box-shadow: 0 0 18px rgba(192, 192, 192, 0.5),
      0 0 10px rgba(255, 255, 255, 0.4) inset;
  }

  /* Gold */
  #EDark:checked ~ .glass-glider {
    transform: translateX(100%);
    background: linear-gradient(135deg, #ffd70055, #ffcc00);
    box-shadow: 0 0 18px rgba(255, 215, 0, 0.5),
      0 0 10px rgba(255, 235, 150, 0.4) inset;
  }

  /* Platinum */
  #glass-platinum:checked ~ .glass-glider {
    transform: translateX(200%);
    background: linear-gradient(135deg, #d0e7ff55, #a0d8ff);
    box-shadow: 0 0 18px rgba(160, 216, 255, 0.5),
      0 0 10px rgba(200, 240, 255, 0.4) inset;
  }
`;

interface RadioProps {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}

const Radio = ({ mode, setMode }: RadioProps) => {
  return (
    <StyledWrapper $themeMode={mode}>
      <div className="glass-radio-group">
        <input
          type="radio"
          name="plan"
          id="light"
          checked={mode === "light"}
          onChange={() => setMode("light")}
        />
        <label htmlFor="light">Light</label>
        <input
          type="radio"
          name="plan"
          id="EDark"
          checked={mode === "elevatedDark"}
          onChange={() => setMode("elevatedDark")}
        />
        <label htmlFor="EDark">EDark</label>
        <input
          type="radio"
          name="plan"
          id="glass-platinum"
          checked={mode === "dark"}
          onChange={() => setMode("dark")}
        />
        <label htmlFor="glass-platinum">Dark</label>
        <div className="glass-glider" />
      </div>
    </StyledWrapper>
  );
};

const InteractiveNavbar = () => {
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { mode, setMode } = useContext(ThemeModeContext);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const logoutOpen = Boolean(logoutAnchor);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const drop = Boolean(anchorEl2);
  const roleKey = (user?.memberType || "").toString().toLowerCase();
  const roleLabel =
    roleKey === "admin"
      ? t("role.admin")
      : roleKey === "agent"
      ? t("role.agent")
      : t("role.member");

  // language state - initialize with router.locale to match SSR
  const [lang, setLang] = useState<string | null>(router.locale || "en");
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const langOpen = Boolean(langAnchor);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  // Initialize language from localStorage after mount and sync with router.locale
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("locale");
      if (savedLang && savedLang !== router.locale) {
        // If saved language differs from router locale, update the route
        router.replace(router.asPath, router.asPath, {
          locale: savedLang,
          shallow: true,
        });
        setLang(savedLang);
      } else if (router.locale) {
        setLang(router.locale);
      }
    }
  }, []); // Run only once on mount

  // Sync lang state when router.locale changes (when user switches language)
  useEffect(() => {
    if (mounted && router.locale && router.locale !== lang) {
      setLang(router.locale);
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", router.locale);
      }
    }
  }, [router.locale, mounted]);

  const StyledMenu = styled((props: MenuProps) => (
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
      "& .MuiMenu-list": { padding: "4px 0" },
      "& .MuiMenuItem-root": {
        padding: "8px 12px",
        fontSize: "14px",
        minHeight: "unset",
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
        "&:hover": { backgroundColor: "rgba(226, 12, 12, 0.08)" },
      },
    },
  }));

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const nextMode = (): ThemeMode => {
    if (mode === "light") return "elevatedDark";
    if (mode === "elevatedDark") return "dark";
    return "light";
  };

  const handleLogout = async () => {
    try {
      const result = (await sweetConfirmAlert(
        t("Are you sure you want to logout?")
      )) as boolean;
      if (result) {
        localStorage.removeItem("accessToken");

        userVar({
          _id: "",
          memberType: "",
          memberStatus: "",
          memberAuthType: "",
          memberPhone: "",
          memberNick: "",
          memberFullName: "",
          memberImage: "",
          memberAddress: "",
          memberDesc: "",
          memberCars: 0,
          memberRank: 0,
          memberArticles: 0,
          memberPoints: 0,
          memberLikes: 0,
          memberViews: 0,
          memberWarnings: 0,
          memberBlocks: 0,
        });

        await sweetTopSmallSuccessAlert(t("Logged out successfully!"), 1000);

        router.push("/");
      }
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const handleLogin = () => {
    router.push("/account/join");
  };

  const openLangMenu = (e: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(e.currentTarget as HTMLElement);
  };
  const closeLangMenu = () => setLangAnchor(null);
  const chooseLang = async (code: "en" | "kr" | "ru") => {
    try {
      setLang(code);
      if (typeof window !== "undefined") localStorage.setItem("locale", code);
      setLangAnchor(null);
      await router.push(router.asPath, router.asPath, { locale: code });
    } catch {}
  };
  const langClose = () => {
    setAnchorEl2(null);
  };

  const langClick = (e: any) => {
    setAnchorEl2(e.currentTarget);
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
  const currentLangLabel =
    lang === "kr" ? t("Korean") : lang === "ru" ? t("Russian") : t("English");

  return (
    <Box
      component={"div"}
      className={`InteractiveNavbar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="menu-toggle" onClick={toggleNavbar}>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="menu-item">
        <Box component={"div"} className={"user-box"}>
          {user?._id ? (
            <>
              <div
                className={"login-user"}
                onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
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

              <Stack className={"user-info"}>
                {user?.memberType === "ADMIN" ? (
                  <a href="/_admin/users" target={"_blank"}>
                    <Typography className={"view-list"}>{roleLabel}</Typography>
                  </a>
                ) : (
                  <Typography className={"view-list"}>{roleLabel}</Typography>
                )}
              </Stack>
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
        </Box>
      </div>
      <div className="menu-items">
        <Link href={"/"}>
          <div className="menu-item">
            <span className="icon">
              <img
                src="/img/logo/ucar_logo (1).svg"
                alt="Home"
                className="custom-logo"
              />
            </span>
          </div>
        </Link>

        <Link href={"/car"}>
          <div className="menu-item">
            <span className="icon">
              <DirectionsCarIcon sx={{ fontSize: 32 }} />
            </span>
            <span className="label">{t("Cars")}</span>
          </div>
        </Link>

        <Link href={"/agent"}>
          <div className="menu-item">
            <span className="icon">
              <PeopleIcon sx={{ fontSize: 32 }} />
            </span>
            <span className="label">{t("Agents")}</span>
          </div>
        </Link>

        <Link href={"/community?articleCategory=FREE"}>
          <div className="menu-item">
            <span className="icon">
              <ForumIcon sx={{ fontSize: 32 }} />
            </span>
            <span className="label">{t("Community")}</span>
          </div>
        </Link>

        {user?._id && (
          <Link href={"/mypage"}>
            <div className="menu-item">
              <span className="icon">
                <PersonIcon sx={{ fontSize: 32 }} />
              </span>
              <span className="label">{t("My Page")}</span>
            </div>
          </Link>
        )}

        <Link href={"/cs"}>
          <div className="menu-item">
            <span className="icon">
              <HelpIcon sx={{ fontSize: 32 }} />
            </span>
            <span className="label">{t("CS")}</span>
          </div>
        </Link>

        {/* Theme toggle */}
        <div className="theme-toggle">
          <Radio mode={mode} setMode={setMode} />
        </div>

        {/* Language selector (lan-box) */}
        <div className="menu-item" onClick={openLangMenu}>
          <span className="icon">
            <img
              src={`/img/flag/lang${lang || "en"}.png`}
              alt="flag"
              style={{ width: 24, height: 17, borderRadius: 2 }}
            />
          </span>
          <span className="label">{currentLangLabel}</span>
        </div>
        <StyledMenu
          anchorEl={langAnchor}
          open={langOpen}
          onClose={closeLangMenu}
        >
          <MenuItem disableRipple onClick={() => chooseLang("en")}>
            <img
              className="img-flag"
              src={"/img/flag/langen.png"}
              alt="usaFlag"
            />
            {t("English")}
          </MenuItem>
          <MenuItem disableRipple onClick={() => chooseLang("kr")}>
            <img
              className="img-flag"
              src={"/img/flag/langkr.png"}
              alt="koreanFlag"
            />
            {t("Korean")}
          </MenuItem>
          <MenuItem disableRipple onClick={() => chooseLang("ru")}>
            <img
              className="img-flag"
              src={"/img/flag/langru.png"}
              alt="russiaFlag"
            />
            {t("Russian")}
          </MenuItem>
        </StyledMenu>

        {/* Authentication  */}
        <Stack className="auth-section" sx={{ mt: "auto", pt: 2 }}>
          {user?._id ? (
            <div className="menu-item auth-item" onClick={handleLogout}>
              <span className="icon">
                <LogoutIcon sx={{ fontSize: 32 }} />
              </span>
              <span className="label">{t("Logout")}</span>
            </div>
          ) : (
            <div className="menu-item auth-item" onClick={handleLogin}>
              <span className="icon">
                <LoginIcon sx={{ fontSize: 32 }} />
              </span>
              <span className="label">{t("Login")}</span>
            </div>
          )}
        </Stack>
      </div>
    </Box>
  );
};

export default InteractiveNavbar;
