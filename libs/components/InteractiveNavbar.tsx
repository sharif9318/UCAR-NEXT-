import { useReactiveVar } from "@apollo/client";
import { Box, Link, Button, Stack } from "@mui/material";
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

const InteractiveNavbar = () => {
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { mode, setMode } = useContext(ThemeModeContext);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

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

        {/* Global Theme Toggle */}
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
