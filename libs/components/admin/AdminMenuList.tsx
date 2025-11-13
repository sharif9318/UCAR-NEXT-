import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Avatar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ForumIcon from "@mui/icons-material/Forum";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../config";
import useDeviceDetect from "../../hooks/useDeviceDetect";

// Add themeMode and toggleTheme to props
type AdminMenuListProps = {
  themeMode: "light" | "dark";
  toggleTheme: () => void;
  logoutHandler: () => void;
};

const AdminMenuList = ({
  themeMode,
  toggleTheme,
  logoutHandler,
}: AdminMenuListProps) => {
  const router = useRouter();
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  // Use userVar for admin info
  const adminNick = user?.memberNick || "Admin";
  const adminPhone = user?.memberPhone || "";
  const adminImage = user?.memberImage
    ? `${REACT_APP_API_URL}/${user.memberImage}`
    : "/img/profile/defaultUser.svg";

  const [clickMenu, setClickMenu] = useState<any>([]);
  const [clickSubMenu, setClickSubMenu] = useState("");
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const pathnames = router.pathname.split("/").filter((x: any) => x);

  /** LIFECYCLES **/
  useEffect(() => {
    switch (pathnames[1]) {
      case "cars":
        setClickMenu(["Cars"]);
        break;
      case "community":
        setClickMenu(["Community"]);
        break;
      case "cs":
        setClickMenu(["Cs"]);
        break;
      default:
        setClickMenu(["Users"]);
        break;
    }

    switch (pathnames[2]) {
      case "logs":
        setClickSubMenu("Logs");
        break;
      case "inquiry":
        setClickSubMenu("Inquiry");
        break;
      case "notice":
        setClickSubMenu("Notice");
        break;
      case "faq":
        setClickSubMenu("FAQ");
        break;
      case "board_create":
        setClickSubMenu("Board Create");
        break;
      default:
        setClickSubMenu("List");
        break;
    }
  }, []);

  const menu_set = [
    {
      title: "Dashboard",
      icon: <DashboardIcon fontSize="medium" />,
      url: "/_admin/dashboard",
      description: "Admin dashboard overview",
    },
    {
      title: "Users",
      icon: <PeopleAltIcon fontSize="medium" />,
      url: "/_admin/users",
      description: "Manage user accounts",
    },
    {
      title: "Cars",
      icon: <DirectionsCarIcon fontSize="medium" />,
      url: "/_admin/cars",
      description: "Vehicle management",
    },
    {
      title: "Community",
      icon: <ForumIcon fontSize="medium" />,
      url: "/_admin/community",
      description: "Community posts",
    },
    {
      title: "Cs",
      icon: <HeadsetMicIcon fontSize="medium" />,
      url: "#",
      description: "Customer support",
      subMenu: [
        { title: "FAQ", url: "/_admin/cs/faq" },
        { title: "Notice", url: "/_admin/cs/notice" },
        { title: "Inquiry", url: "/_admin/cs/inquiry" },
      ],
    },
  ];

  // Top navigation bar layout (all sidebar elements now in top bar)
  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{ zIndex: 1201 }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          display: "flex",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        {/* Logo (left) */}
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 180 }}>
          <Link href="/">
            <Box
              component="img"
              src="/img/logo/logoText.svg"
              alt="logo"
              sx={{ height: 36, cursor: "pointer" }}
            />
          </Link>
        </Box>
        {/* Centered Menu */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ flex: 1, justifyContent: "center" }}
        >
          {menu_set.map((item, idx) => {
            const isActive =
              router.pathname.startsWith(item.url) ||
              (item.title === "Cs" && router.pathname.startsWith("/_admin/cs"));
            const hasSubMenu = !!item.subMenu;
            return (
              <Box key={item.title} sx={{ position: "relative" }}>
                <Tooltip title={item.description} arrow enterDelay={500}>
                  <Button
                    startIcon={item.icon}
                    endIcon={
                      hasSubMenu ? (
                        clickMenu[0] === item.title ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      ) : null
                    }
                    color={isActive ? "primary" : "inherit"}
                    variant={isActive ? "contained" : "text"}
                    sx={{
                      fontWeight: isActive ? 700 : 400,
                      bgcolor: isActive ? "primary.light" : "transparent",
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      minWidth: 120,
                      boxShadow: isActive ? 2 : 0,
                      textTransform: "none",
                    }}
                    onClick={() => {
                      if (hasSubMenu) {
                        setClickMenu([item.title]);
                      } else {
                        router.push(item.url);
                      }
                    }}
                    onMouseEnter={() => setHoveredMenu(item.title)}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    {item.title}
                  </Button>
                </Tooltip>
                {/* Submenu dropdown */}
                {hasSubMenu && clickMenu[0] === item.title && (
                  <Box
                    className="submenu-dropdown"
                    sx={{
                      position: "absolute",
                      top: 48,
                      left: 0,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      boxShadow: 3,
                      minWidth: 180,
                      py: 1,
                      zIndex: 2000,
                    }}
                    onMouseLeave={() => setClickMenu([])}
                  >
                    {item.subMenu.map((sub: any) => (
                      <Link
                        href={sub.url}
                        key={sub.title}
                        className="submenu-link"
                      >
                        <Button
                          fullWidth
                          color={
                            router.pathname === sub.url ? "primary" : "inherit"
                          }
                          sx={{
                            justifyContent: "flex-start",
                            px: 2,
                            py: 1.2,
                            borderRadius: 1,
                            fontWeight: router.pathname === sub.url ? 700 : 400,
                            bgcolor:
                              router.pathname === sub.url
                                ? "primary.light"
                                : "transparent",
                            textTransform: "none",
                          }}
                          onClick={() => setClickMenu([])}
                        >
                          {sub.title}
                        </Button>
                      </Link>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
        {/* Admin Info Box (right) */}
        <Stack direction="row" alignItems="center" spacing={1} className="user">
          {/* Theme Toggle Button */}
          <Tooltip
            title={
              themeMode === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            <IconButton onClick={toggleTheme} color="primary" sx={{ mr: 1 }}>
              {themeMode === "dark" ? (
                <span role="img" aria-label="Light mode">
                  🌞
                </span>
              ) : (
                <span role="img" aria-label="Dark mode">
                  🌙
                </span>
              )}
            </IconButton>
          </Tooltip>
          {/* Logout Button */}
          <Tooltip title="Logout">
            <IconButton onClick={logoutHandler} color="error" sx={{ mr: 1 }}>
              <span role="img" aria-label="Logout">
                🚪
              </span>
            </IconButton>
          </Tooltip>
          <Avatar src={adminImage} sx={{ width: 40, height: 40 }} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {adminNick} <br />
            {adminPhone}
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AdminMenuList;
