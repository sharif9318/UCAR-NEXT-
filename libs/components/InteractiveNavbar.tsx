import { useReactiveVar } from "@apollo/client";
import { Box, Link, Stack, Menu, MenuItem } from "@mui/material";
import { userVar, socketVar } from "../../apollo/store";
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../apollo/user/mutation";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { Logout } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import {
  sweetConfirmAlert,
  sweetTopSmallSuccessAlert,
  sweetErrorAlert,
} from "./../sweetAlert";
import { ThemeModeContext } from "../../pages/_app";
import { REACT_APP_API_URL } from "../config";
import { getJwtToken, updateUserInfo } from "../auth";
import { Messages } from "../config";
import { Member } from "../types/member/member";
import { RippleBadge } from "../../scss/MaterialTheme/styled";
import AuthPopup from "./AuthPopup";
import { CustomJwtPayload } from "../types/customJwtPayload";

const NAV_ITEMS = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/car", icon: DirectionsCarIcon, label: "Cars" },
  { href: "/agent", icon: PeopleIcon, label: "Car Dealers" },
  {
    href: "/community?articleCategory=FREE",
    icon: ForumIcon,
    label: "Social Garage",
  },
  {
    href: "/mypage",
    icon: PersonIcon,
    label: "My Dashboard",
    requiresAuth: true,
  },
  { href: "/cs", icon: HelpIcon, label: "Help Desk" },
];

const LANGUAGES = [
  { code: "en" as const, label: "English", flag: "/img/flag/langen.png" },
  { code: "kr" as const, label: "Korean", flag: "/img/flag/langkr.png" },
  { code: "ru" as const, label: "Russian", flag: "/img/flag/langru.png" },
];

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member;
}

interface InfoPayload {
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}

const InteractiveNavbar = () => {
  const user = useReactiveVar(userVar);
  const socket = useReactiveVar(socketVar);
  const { t, i18n } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { mode, setMode } = useContext(ThemeModeContext);
  const [memberLogin] = useMutation(LOGIN);
  const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>(router.locale || "en");
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);

  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [messageInput, setMessageInput] = useState<string>("");
  const chatContentRef = useRef<HTMLDivElement>(null);

  const roleKey = (user?.memberType || "").toString().toLowerCase();
  const roleLabel =
    roleKey === "admin"
      ? t("role.admin")
      : roleKey === "agent"
      ? t("role.agent")
      : t("role.member");

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  useEffect(() => {
    setMounted(true);
    initializeLanguage();
  }, []);

  useEffect(() => {
    if (
      mounted &&
      router.locale &&
      router.locale !== currentLang &&
      !isChangingLanguage
    ) {
      setCurrentLang(router.locale);
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", router.locale);
      }
    }
  }, [router.locale, mounted, currentLang, isChangingLanguage]);

  // Socket handling
  useEffect(() => {
    if (!socket) return;
    const handler = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      switch (data.event) {
        case "info":
          setOnlineUsers(data.totalClients);
          break;
        case "getMessages":
          setMessagesList(data.list);
          break;
        case "message":
          setMessagesList((prev) => [...(prev || []), data]);
          break;
      }
    };
    socket.onmessage = handler;
    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

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

  const handleLogout = async () => {
    try {
      const result = await sweetConfirmAlert(t("mypage.confirmLogout"));
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
        await sweetTopSmallSuccessAlert(t("mypage.profileUpdated"), 1000);
        setLogoutAnchor(null);
        setIsMobileMenuOpen(false);
        router.push("/");
      }
    } catch (err) {
      console.log("Logout error:", err);
      sweetErrorAlert(t("common.errorLoading"));
    }
  };

  const handleLogin = () => {
    setAuthPopupOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleAuthPopupLogin = async (nick: string, password: string) => {
    try {
      const result = await memberLogin({
        variables: { input: { memberNick: nick, memberPassword: password } },
      });

      if (result.data?.login) {
        const loginData = result.data.login;
        if (loginData.accessToken) {
          localStorage.setItem("accessToken", loginData.accessToken);
        }

        const userData: CustomJwtPayload = {
          _id: loginData._id || "",
          memberType: loginData.memberType || "",
          memberStatus: loginData.memberStatus || "",
          memberAuthType: loginData.memberAuthType || "",
          memberPhone: loginData.memberPhone || "",
          memberNick: loginData.memberNick || "",
          memberFullName: loginData.memberFullName || "",
          memberImage: loginData.memberImage || "",
          memberAddress: loginData.memberAddress || "",
          memberDesc: loginData.memberDesc || "",
          memberCars: loginData.memberCars || 0,
          memberRank: loginData.memberRank || 0,
          memberArticles: loginData.memberArticles || 0,
          memberPoints: loginData.memberPoints || 0,
          memberLikes: loginData.memberLikes || 0,
          memberViews: loginData.memberViews || 0,
          memberWarnings: loginData.memberWarnings || 0,
          memberBlocks: loginData.memberBlocks || 0,
        };

        userVar(userData);
        await sweetTopSmallSuccessAlert(t("Login successful"), 1000);
        setAuthPopupOpen(false);
        await router.push(router.asPath, undefined, { shallow: true });
      }
    } catch (err: any) {
      console.error("Login error:", err);
      sweetErrorAlert(
        err.message || t("Login failed. Please check your credentials.")
      );
      throw err;
    }
  };

  const handleLanguageChange = async (code: "en" | "kr" | "ru") => {
    if (isChangingLanguage || code === currentLang) return;
    try {
      setIsChangingLanguage(true);
      setCurrentLang(code);
      localStorage.setItem("locale", code);
      await i18n.changeLanguage(code);
      await router.push(router.asPath, router.asPath, {
        locale: code,
        scroll: false,
      });
      if (typeof document !== "undefined") {
        document.documentElement.lang = code;
      }
      setLangAnchor(null);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Language change error:", error);
      sweetErrorAlert(t("common.errorLoading"));
      setCurrentLang(router.locale || "en");
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const getInputMessageHandler = useCallback((e: any) => {
    setMessageInput(e.target.value);
  }, []);

  const getKeyHandler = (e: any) => {
    if (e.key === "Enter") onClickHandler();
  };

  const onClickHandler = () => {
    if (!messageInput) sweetErrorAlert(Messages.error4);
    else {
      socket.send(JSON.stringify({ event: "message", data: messageInput }));
      setMessageInput("");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {authPopupOpen && (
        <AuthPopup
          open={authPopupOpen}
          onClose={() => setAuthPopupOpen(false)}
          onLogin={handleAuthPopupLogin}
        />
      )}

      {/* Mobile Hamburger Button */}
      <Box component="div" className="mobile-nav-toggle">
        <button
          className="hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </Box>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <Box
          component="div"
          className="mobile-nav-overlay"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Navigation Drawer */}
      <Box
        component="div"
        className={`InteractiveNavbar ${
          isExpanded ? "expanded" : "collapsed"
        } ${isMobileMenuOpen ? "mobile-open" : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Desktop Menu Toggle Button */}
        <button
          className="menu-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="icon">
            <MenuIcon />
          </span>
          <span className="text">MENU</span>
        </button>

        <div className="menu-items">
          {/* User Profile Section */}
          <Box component="div" className="user-section">
            {!user?._id ? (
              <div
                className="user-profile-item user-profile-login"
                onClick={handleLogin}
              >
                <span className="icon">
                  <AccountCircleOutlinedIcon className="user-icon" />
                </span>
                <span className="label">
                  {t("Login")} / {t("Register")}
                </span>
              </div>
            ) : (
              <div
                className="user-profile-item"
                onClick={(e) => setLogoutAnchor(e.currentTarget)}
              >
                <span className="icon user-avatar">
                  <img
                    src={
                      user?.memberImage
                        ? `${REACT_APP_API_URL}/${user.memberImage}`
                        : "/img/profile/defaultUser.svg"
                    }
                    alt={t("mypage.myProfile")}
                    className="user-avatar-img"
                  />
                </span>
                <span className="label user-info-label">
                  <span className="user-name">
                    {user?.memberNick || t("mypage.guest")}
                  </span>
                  <span className="user-role">{roleLabel}</span>
                </span>
              </div>
            )}
          </Box>

          <Menu
            id="logout-menu"
            anchorEl={logoutAnchor}
            open={Boolean(logoutAnchor)}
            onClose={() => setLogoutAnchor(null)}
            className="logout-menu"
          >
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" className="logout-icon" />
              {t("mypage.logout")}
            </MenuItem>
          </Menu>

          {/* Navigation Items */}
          {NAV_ITEMS.map((item) => {
            if (item.requiresAuth && !user?._id) return null;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className="menu-item" onClick={handleNavItemClick}>
                  <span className="icon">
                    <Icon className="nav-icon" />
                  </span>
                  <span className="label">{t(item.label)}</span>
                </div>
              </Link>
            );
          })}

          {/* Theme Toggle */}
          <div className="theme-toggle">
            <div className="glass-radio-group">
              <input
                type="radio"
                name="theme"
                id="light"
                checked={mode === "light"}
                onChange={() => setMode("light")}
              />
              <label htmlFor="light">Light</label>
              <input
                type="radio"
                name="theme"
                id="EDark"
                checked={mode === "elevatedDark"}
                onChange={() => setMode("elevatedDark")}
              />
              <label htmlFor="EDark">EDark</label>
              <input
                type="radio"
                name="theme"
                id="dark"
                checked={mode === "dark"}
                onChange={() => setMode("dark")}
              />
              <label htmlFor="dark">Dark</label>
              <div className="glass-glider" />
            </div>
          </div>

          {/* Language Selector */}
          <div
            className="menu-item"
            onClick={(e) => setLangAnchor(e.currentTarget)}
          >
            <span className="icon">
              <img
                src={currentLanguage.flag}
                alt={t(currentLanguage.label)}
                className="flag-img"
              />
            </span>
            <span className="label">{t(currentLanguage.label)}</span>
          </div>

          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
            className="language-menu"
          >
            {LANGUAGES.map((language) => (
              <MenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                selected={language.code === currentLang}
              >
                <img
                  className="img-flag"
                  src={language.flag}
                  alt={language.label}
                />
                {t(language.label)}
              </MenuItem>
            ))}
          </Menu>

          {/* Chat Button */}
          <div className={`chat-button-wrapper ${chatOpen ? "chat-open" : ""}`}>
            <button
              className={`chat-button ${chatOpen ? "open" : ""}`}
              onClick={() => setChatOpen(!chatOpen)}
            >
              {chatOpen ? (
                <CloseFullscreenIcon className="chat-icon" />
              ) : (
                <>
                  <svg
                    className="chat-svg"
                    height="1.6em"
                    fill="white"
                    viewBox="0 0 1000 1000"
                  >
                    <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
                  </svg>
                  <span className="tooltip">{t("Community")}</span>
                </>
              )}
            </button>
            {isExpanded && <span className="label">{t("Chat")}</span>}
          </div>

          {/* Chat Frame */}
          <Stack className={`chat-frame ${chatOpen ? "open" : ""}`}>
            <Box className="chat-top" component="div">
              <div className="chat-title">Online Chat</div>
              <RippleBadge className="chat-badge" badgeContent={onlineUsers} />
            </Box>
            <Box className="chat-content" ref={chatContentRef} component="div">
              <ScrollableFeed>
                <Stack className="chat-main">
                  <Box className="chat-welcome-box" component="div">
                    <div className="welcome">Welcome to Live chat!</div>
                  </Box>
                  {messagesList?.map((ele: MessagePayload, index: number) => {
                    const { text, memberData } = ele;
                    const memberImage = memberData?.memberImage
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${memberData.memberImage}`
                      : "/img/profile/defaultUser.svg";

                    return memberData?._id === user?._id ? (
                      <Box
                        key={index}
                        className="chat-msg-box chat-msg-right"
                        component="div"
                      >
                        <div className="msg-right">{text}</div>
                      </Box>
                    ) : (
                      <Box
                        key={index}
                        className="chat-msg-box chat-msg-left"
                        component="div"
                      >
                        <img
                          src={memberImage}
                          alt="User"
                          className="chat-avatar"
                        />
                        <div className="msg-left">{text}</div>
                      </Box>
                    );
                  })}
                </Stack>
              </ScrollableFeed>
            </Box>
            <Box className="chat-bott" component="div">
              <input
                type="text"
                name="message"
                className="msg-input"
                placeholder="Type message"
                value={messageInput}
                onChange={getInputMessageHandler}
                onKeyDown={getKeyHandler}
              />
              <button className="send-msg-btn" onClick={onClickHandler}>
                <SendIcon className="send-icon" />
              </button>
            </Box>
          </Stack>

          {/* Auth Section */}
          <Stack className="auth-section">
            <div
              className="menu-item auth-item"
              onClick={user?._id ? handleLogout : handleLogin}
            >
              <span className="icon">
                {user?._id ? (
                  <LogoutIcon className="auth-icon" />
                ) : (
                  <LoginIcon className="auth-icon" />
                )}
              </span>
              <span className="label">
                {user?._id ? t("mypage.logout") : t("Login")}
              </span>
            </div>
          </Stack>
        </div>
      </Box>
    </>
  );
};

export default InteractiveNavbar;
