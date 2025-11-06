import { useReactiveVar } from "@apollo/client";
import {
  Box,
  Link,
  Button,
  Stack,
  Menu,
  MenuItem,
  MenuProps,
} from "@mui/material";
import { userVar } from "../../apollo/store";
import { useEffect, useState, useContext } from "react";
import { getJwtToken, updateUserInfo } from "../auth";
import { useTranslation } from "next-i18next";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useRouter } from "next/router";
import { sweetConfirmAlert, sweetTopSmallSuccessAlert } from "./../sweetAlert";
import { ThemeModeContext, ThemeMode } from "../../pages/_app";
import { styled, alpha } from "@mui/material/styles";

const InteractiveNavbar = () => {
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { mode, setMode } = useContext(ThemeModeContext);

  // language state
  const [lang, setLang] = useState<string | null>(
    (typeof window !== "undefined" &&
      (localStorage.getItem("locale") || router.locale)) ||
      "en"
  );
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const langOpen = Boolean(langAnchor);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

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
        <div className="menu-item" onClick={() => setMode(nextMode())}>
          <span className="icon">
            <Brightness4Icon sx={{ fontSize: 28 }} />
          </span>
          <span className="label">
            {mode === "light"
              ? "Light"
              : mode === "elevatedDark"
              ? "Elevated"
              : "Dark"}
          </span>
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
