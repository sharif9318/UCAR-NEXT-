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
import { useRouter } from "next/router";
import { styled, alpha } from "@mui/material/styles";
import React from "react";

// Icons
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Logout } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { CaretDown } from "phosphor-react";

// Utilities
import { sweetConfirmAlert, sweetTopSmallSuccessAlert } from "./../sweetAlert";
import { ThemeModeContext, ThemeMode } from "../../pages/_app";
import { REACT_APP_API_URL } from "../config";
import { getJwtToken, logOut, updateUserInfo } from "../auth";

// Constants
const NAV_ITEMS = [
  { href: "/", icon: "logo", label: "Home", customIcon: true },
  { href: "/car", icon: DirectionsCarIcon, label: "Cars" },
  { href: "/agent", icon: PeopleIcon, label: "Agents" },
  {
    href: "/community?articleCategory=FREE",
    icon: ForumIcon,
    label: "Community",
  },
  { href: "/mypage", icon: PersonIcon, label: "My Page", requiresAuth: true },
  { href: "/cs", icon: HelpIcon, label: "CS" },
];

const LANGUAGES = [
  { code: "en" as const, label: "English", flag: "/img/flag/langen.png" },
  { code: "kr" as const, label: "Korean", flag: "/img/flag/langkr.png" },
  { code: "ru" as const, label: "Russian", flag: "/img/flag/langru.png" },
];

// Styled Components
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

  #light:checked ~ .glass-glider {
    transform: translateX(0%);
    background: linear-gradient(135deg, #c0c0c055, #242121ff);
    box-shadow: 0 0 18px rgba(192, 192, 192, 0.5),
      0 0 10px rgba(255, 255, 255, 0.4) inset;
  }

  #EDark:checked ~ .glass-glider {
    transform: translateX(100%);
    background: linear-gradient(135deg, #ffd70055, #ffcc00);
    box-shadow: 0 0 18px rgba(255, 215, 0, 0.5),
      0 0 10px rgba(255, 235, 150, 0.4) inset;
  }

  #glass-platinum:checked ~ .glass-glider {
    transform: translateX(200%);
    background: linear-gradient(135deg, #d0e7ff55, #a0d8ff);
    box-shadow: 0 0 18px rgba(160, 216, 255, 0.5),
      0 0 10px rgba(200, 240, 255, 0.4) inset;
  }
`;

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

// Components
interface RadioProps {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}

const ThemeRadio = ({ mode, setMode }: RadioProps) => {
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

interface UserProfileProps {
  user: any;
  roleLabel: string;
  onLogoutClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const UserProfile = ({ user, roleLabel, onLogoutClick }: UserProfileProps) => {
  const { t } = useTranslation("common");

  if (!user?._id) {
    return (
      <Link href={"/account/join"}>
        <div className={"join-box"}>
          <AccountCircleOutlinedIcon />
          <span>
            {t("Login")} / {t("Register")}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <>
      <div className={"login-user"} onClick={onLogoutClick}>
        <img
          src={
            user?.memberImage
              ? `${REACT_APP_API_URL}/${user.memberImage}`
              : "/img/profile/defaultUser.svg"
          }
          alt="User profile"
        />
      </div>
      <Stack className={"user-info"}>
        {user?.memberType === "ADMIN" ? (
          <a href="/_admin/users" target={"_blank"} rel="noopener noreferrer">
            <Typography className={"view-list"}>{roleLabel}</Typography>
          </a>
        ) : (
          <Typography className={"view-list"}>{roleLabel}</Typography>
        )}
      </Stack>
    </>
  );
};

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (code: "en" | "kr" | "ru") => void;
}

const LanguageSelector = ({
  currentLang,
  onLanguageChange,
}: LanguageSelectorProps) => {
  const { t } = useTranslation("common");
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const langOpen = Boolean(langAnchor);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === currentLang) || LANGUAGES[0];

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setLangAnchor(null);
  };

  const handleLanguageSelect = (code: "en" | "kr" | "ru") => {
    onLanguageChange(code);
    handleCloseMenu();
  };

  return (
    <>
      <div className="menu-item" onClick={handleOpenMenu}>
        <span className="icon">
          <img
            src={`/img/flag/lang${currentLang}.png`}
            alt="flag"
            style={{ width: 24, height: 17, borderRadius: 2 }}
          />
        </span>
        <span className="label">{t(currentLanguage.label)}</span>
      </div>
      <StyledMenu
        anchorEl={langAnchor}
        open={langOpen}
        onClose={handleCloseMenu}
      >
        {LANGUAGES.map((language) => (
          <MenuItem
            key={language.code}
            disableRipple
            onClick={() => handleLanguageSelect(language.code)}
          >
            <img
              className="img-flag"
              src={language.flag}
              alt={`${language.label} flag`}
            />
            {t(language.label)}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

interface NavigationItemProps {
  href: string;
  icon: any;
  label: string;
  customIcon?: boolean;
  requiresAuth?: boolean;
  user?: any;
}

const NavigationItem = ({
  href,
  icon: Icon,
  label,
  customIcon = false,
  requiresAuth = false,
  user,
}: NavigationItemProps) => {
  const { t } = useTranslation("common");

  // Don't render auth-required items if user is not logged in
  if (requiresAuth && !user?._id) {
    return null;
  }

  return (
    <Link href={href}>
      <div className="menu-item">
        <span className="icon">
          {customIcon ? (
            <img
              src="/img/logo/ucar_logo (1).svg"
              alt="Home"
              className="custom-logo"
            />
          ) : (
            <Icon sx={{ fontSize: 32 }} />
          )}
        </span>
        <span className="label">{t(label)}</span>
      </div>
    </Link>
  );
};

interface AuthSectionProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const AuthSection = ({
  isAuthenticated,
  onLogin,
  onLogout,
}: AuthSectionProps) => {
  const { t } = useTranslation("common");

  return (
    <Stack className="auth-section" sx={{ mt: "auto", pt: 2 }}>
      <div
        className="menu-item auth-item"
        onClick={isAuthenticated ? onLogout : onLogin}
      >
        <span className="icon">
          {isAuthenticated ? (
            <LogoutIcon sx={{ fontSize: 32 }} />
          ) : (
            <LoginIcon sx={{ fontSize: 32 }} />
          )}
        </span>
        <span className="label">
          {isAuthenticated ? t("Logout") : t("Login")}
        </span>
      </div>
    </Stack>
  );
};

// Main Component
const InteractiveNavbar = () => {
  const user = useReactiveVar(userVar);
  const { t } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { mode, setMode } = useContext(ThemeModeContext);

  const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
  const logoutOpen = Boolean(logoutAnchor);

  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>(router.locale || "en");

  // User role calculation
  const roleKey = (user?.memberType || "").toString().toLowerCase();
  const roleLabel =
    roleKey === "admin"
      ? t("role.admin")
      : roleKey === "agent"
      ? t("role.agent")
      : t("role.member");

  // Effects
  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  useEffect(() => {
    setMounted(true);
    initializeLanguage();
  }, []);

  useEffect(() => {
    if (mounted && router.locale && router.locale !== currentLang) {
      setCurrentLang(router.locale);
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", router.locale);
      }
    }
  }, [router.locale, mounted, currentLang]);

  // Handlers
  const initializeLanguage = () => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("locale");
      if (savedLang && savedLang !== router.locale) {
        router.replace(router.asPath, router.asPath, {
          locale: savedLang,
          shallow: true,
        });
        setCurrentLang(savedLang);
      } else if (router.locale) {
        setCurrentLang(router.locale);
      }
    }
  };

  const handleLogoutClick = (event: React.MouseEvent<HTMLElement>) => {
    setLogoutAnchor(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      const result = await sweetConfirmAlert(
        t("Are you sure you want to logout?")
      );
      if (result) {
        localStorage.removeItem("accessToken");

        // Reset user state
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
        setLogoutAnchor(null);
        router.push("/");
      }
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const handleLogin = () => {
    router.push("/account/join");
  };

  const handleLanguageChange = async (code: "en" | "kr" | "ru") => {
    try {
      setCurrentLang(code);
      localStorage.setItem("locale", code);
      await router.push(router.asPath, router.asPath, { locale: code });
    } catch (error) {
      console.error("Language change error:", error);
    }
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

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
          <UserProfile
            user={user}
            roleLabel={roleLabel}
            onLogoutClick={handleLogoutClick}
          />
        </Box>

        <Menu
          id="logout-menu"
          anchorEl={logoutAnchor}
          open={logoutOpen}
          onClose={() => setLogoutAnchor(null)}
          sx={{ mt: "5px" }}
        >
          <MenuItem onClick={handleLogout}>
            <Logout
              fontSize="small"
              style={{ color: "blue", marginRight: "10px" }}
            />
            {t("Logout")}
          </MenuItem>
        </Menu>
      </div>

      <div className="menu-items">
        {NAV_ITEMS.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            customIcon={item.customIcon}
            requiresAuth={item.requiresAuth}
            user={user}
          />
        ))}

        {/* Theme Toggle */}
        <div className="theme-toggle">
          <ThemeRadio mode={mode} setMode={setMode} />
        </div>

        {/* Language Selector */}
        <LanguageSelector
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />

        {/* Authentication Section */}
        <AuthSection
          isAuthenticated={!!user?._id}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </div>
    </Box>
  );
};

export default InteractiveNavbar;
