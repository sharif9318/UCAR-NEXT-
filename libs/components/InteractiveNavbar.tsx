import { useReactiveVar } from "@apollo/client";
import { Box, Link, Stack, Menu, MenuItem, Avatar } from "@mui/material";
import { userVar, socketVar } from "../../apollo/store";
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { styled, alpha } from "@mui/material/styles";
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

import {
  sweetConfirmAlert,
  sweetTopSmallSuccessAlert,
  sweetErrorAlert,
} from "./../sweetAlert";
import { ThemeModeContext, ThemeMode } from "../../pages/_app";
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

const StyledMenu = styled(Menu)(({ theme }) => ({
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
  onLoginClick?: () => void;
}

const UserProfile = ({
  user,
  roleLabel,
  onLogoutClick,
  onLoginClick,
}: UserProfileProps) => {
  const { t } = useTranslation("common");

  if (!user?._id) {
    return (
      <div
        className="user-profile-item user-profile-login"
        onClick={onLoginClick}
      >
        <span className="icon">
          <AccountCircleOutlinedIcon sx={{ fontSize: 32 }} />
        </span>
        <span className="label">
          {t("Login")} / {t("Register")}
        </span>
      </div>
    );
  }

  return (
    <div className="user-profile-item" onClick={onLogoutClick}>
      <span className="icon user-avatar">
        <img
          src={
            user?.memberImage
              ? `${REACT_APP_API_URL}/${user.memberImage}`
              : "/img/profile/defaultUser.svg"
          }
          alt={t("mypage.myProfile")}
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </span>
      <span className="label user-info-label">
        <span className="user-name">
          {user?.memberNick || t("mypage.guest")}
        </span>
        <span className="user-role">{roleLabel}</span>
      </span>
    </div>
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
            src={currentLanguage.flag}
            alt={`${t(currentLanguage.label)} flag`}
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
            selected={language.code === currentLang}
          >
            <img
              className="img-flag"
              src={language.flag}
              alt={`${language.label} flag`}
              style={{ marginRight: "8px", width: "20px", height: "14px" }}
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
  requiresAuth?: boolean;
  user?: any;
}

const NavigationItem = ({
  href,
  icon: Icon,
  label,
  requiresAuth = false,
  user,
}: NavigationItemProps) => {
  const { t } = useTranslation("common");

  if (requiresAuth && !user?._id) {
    return null;
  }

  return (
    <Link href={href}>
      <div className="menu-item">
        <span className="icon">
          <Icon sx={{ fontSize: 32 }} />
        </span>
        <span className="label">{t(label)}</span>
      </div>
    </Link>
  );
};

interface ChatButtonProps {
  isExpanded: boolean;
}

const ChatButton = ({ isExpanded }: ChatButtonProps) => {
  const { t } = useTranslation("common");
  const user = useReactiveVar(userVar);
  const socket = useReactiveVar(socketVar);
  const [chatOpen, setChatOpen] = useState(false);
  const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [messageInput, setMessageInput] = useState<string>("");
  const chatContentRef = useRef<HTMLDivElement>(null);
  const textInput = useRef(null);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      switch (data.event) {
        case "info": {
          const newInfo: InfoPayload = data;
          setOnlineUsers(newInfo.totalClients);
          break;
        }
        case "getMessages": {
          const list: MessagePayload[] = data.list;
          setMessagesList(list);
          break;
        }
        case "message": {
          const newMessage: MessagePayload = data;
          setMessagesList((prevMessages) => [
            ...(prevMessages || []),
            newMessage,
          ]);
          break;
        }
      }
    };
    socket.onmessage = handler;
    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  const handleOpenChat = () => {
    setChatOpen((prev) => !prev);
  };

  const getInputMessageHandler = useCallback(
    (e: any) => {
      const text = e.target.value;
      setMessageInput(text);
    },
    [messageInput]
  );

  const getKeyHandler = (e: any) => {
    try {
      if (e.key === "Enter") {
        onClickHandler();
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onClickHandler = () => {
    if (!messageInput) sweetErrorAlert(Messages.error4);
    else {
      socket.send(JSON.stringify({ event: "message", data: messageInput }));
      setMessageInput("");
    }
  };

  return (
    <>
      <div className={`chat-button-wrapper ${chatOpen ? "chat-open" : ""}`}>
        <button
          className={`chat-button ${chatOpen ? "open" : ""}`}
          onClick={handleOpenChat}
          aria-label="Toggle chat"
        >
          {chatOpen ? (
            <CloseFullscreenIcon style={{ color: "white" }} />
          ) : (
            <>
              <svg
                height="1.6em"
                fill="white"
                xmlSpace="preserve"
                viewBox="0 0 1000 1000"
                y="0px"
                x="0px"
                version="1.1"
              >
                <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
              </svg>
              <span className="tooltip">{t("Community")}</span>
            </>
          )}
        </button>
        {isExpanded && <span className="label">{t("Chat")}</span>}
      </div>

      <Stack className={`chat-frame ${chatOpen ? "open" : ""}`}>
        <Box className={"chat-top"} component={"div"}>
          <div style={{ fontFamily: "Nunito" }}>Online Chat</div>
          <RippleBadge
            style={{ margin: "-18px 0 0 21px" }}
            badgeContent={onlineUsers}
          />
        </Box>
        <Box
          className={"chat-content"}
          id="chat-content"
          ref={chatContentRef}
          component={"div"}
        >
          <ScrollableFeed>
            <Stack className={"chat-main"}>
              <Box
                flexDirection={"row"}
                style={{ display: "flex" }}
                sx={{ m: "10px 0px" }}
                component={"div"}
              >
                <div className={"welcome"}>Welcome to Live chat!</div>
              </Box>
              {messagesList?.map((ele: MessagePayload, index: number) => {
                const { text, memberData } = ele;
                const memberImage = memberData?.memberImage
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${memberData.memberImage}`
                  : "/img/profile/defaultUser.svg";

                return memberData?._id === user?._id ? (
                  <Box
                    key={index}
                    component={"div"}
                    flexDirection={"row"}
                    style={{ display: "flex" }}
                    alignItems={"flex-end"}
                    justifyContent={"flex-end"}
                    sx={{ m: "10px 0px" }}
                  >
                    <div className={"msg-right"}>{text}</div>
                  </Box>
                ) : (
                  <Box
                    key={index}
                    flexDirection={"row"}
                    style={{ display: "flex" }}
                    sx={{ m: "10px 0px" }}
                    component={"div"}
                  >
                    <Avatar alt={"join"} src={memberImage} />
                    <div className={"msg-left"}>{text}</div>
                  </Box>
                );
              })}
            </Stack>
          </ScrollableFeed>
        </Box>
        <Box className={"chat-bott"} component={"div"}>
          <input
            ref={textInput}
            type={"text"}
            name={"message"}
            className={"msg-input"}
            placeholder={"Type message"}
            value={messageInput}
            onChange={getInputMessageHandler}
            onKeyDown={getKeyHandler}
          />
          <button
            className={"send-msg-btn"}
            onClick={onClickHandler}
            aria-label="Send message"
          >
            <SendIcon style={{ color: "#fff" }} />
          </button>
        </Box>
      </Stack>
    </>
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
          {isAuthenticated ? t("mypage.logout") : t("Login")}
        </span>
      </div>
    </Stack>
  );
};

const InteractiveNavbar = () => {
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { mode, setMode } = useContext(ThemeModeContext);
  const [memberLogin] = useMutation(LOGIN);
  const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
  const logoutOpen = Boolean(logoutAnchor);
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>(router.locale || "en");
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);

  const roleKey = (user?.memberType || "").toString().toLowerCase();
  const roleLabel =
    roleKey === "admin"
      ? t("role.admin")
      : roleKey === "agent"
      ? t("role.agent")
      : t("role.member");

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
        router.push("/");
      }
    } catch (err) {
      console.log("Logout error:", err);
      sweetErrorAlert(t("common.errorLoading"));
    }
  };

  const handleLogin = () => {
    setAuthPopupOpen(true);
  };

  const handleAuthPopupLogin = async (nick: string, password: string) => {
    try {
      const result = await memberLogin({
        variables: {
          input: {
            memberNick: nick,
            memberPassword: password,
          },
        },
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
    } catch (error) {
      console.error("Language change error:", error);
      sweetErrorAlert(t("common.errorLoading"));
      setCurrentLang(router.locale || "en");
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
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

      <Box
        component={"div"}
        className={`InteractiveNavbar ${isExpanded ? "expanded" : "collapsed"}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <button
          className="menu-toggle-btn"
          onClick={toggleNavbar}
          aria-label="Toggle menu"
        >
          <span className="icon">
            <svg viewBox="0 0 175 80" width="40" height="40">
              <rect width="80" height="15" fill="currentColor" rx="10"></rect>
              <rect
                y="30"
                width="80"
                height="15"
                fill="currentColor"
                rx="10"
              ></rect>
              <rect
                y="60"
                width="80"
                height="15"
                fill="currentColor"
                rx="10"
              ></rect>
            </svg>
          </span>
          <span className="text">MENU</span>
        </button>

        <div className="menu-items">
          <Box component={"div"} className={"user-section"}>
            <UserProfile
              user={user}
              roleLabel={roleLabel}
              onLogoutClick={handleLogoutClick}
              onLoginClick={handleLogin}
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
              {t("mypage.logout")}
            </MenuItem>
          </Menu>

          {NAV_ITEMS.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              requiresAuth={item.requiresAuth}
              user={user}
            />
          ))}

          <div className="theme-toggle">
            <ThemeRadio mode={mode} setMode={setMode} />
          </div>

          <LanguageSelector
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
          />

          <ChatButton isExpanded={isExpanded} />

          <AuthSection
            isAuthenticated={!!user?._id}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      </Box>
    </>
  );
};

export default InteractiveNavbar;
