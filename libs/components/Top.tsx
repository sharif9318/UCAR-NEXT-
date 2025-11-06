import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getJwtToken, logOut, updateUserInfo } from "../auth";
import { Stack, Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { CaretDown, Columns } from "phosphor-react";
import useDeviceDetect from "../hooks/useDeviceDetect";
import Link from "next/link";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import { Logout } from "@mui/icons-material";
import { REACT_APP_API_URL } from "../config";
import { Car } from "../types/car/car";
import { Typography } from "@mui/material";
import { ThemeModeContext, ThemeMode } from "../../pages/_app";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

interface TopProps {
  trendingCar?: Car;
}

const Top = ({ trendingCar }: TopProps) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  // Initialize with router.locale to match server rendering
  const [lang, setLang] = useState<string | null>(router.locale || null);
  const drop = Boolean(anchorEl2);
  const [colorChange, setColorChange] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
  let open = Boolean(anchorEl);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const logoutOpen = Boolean(logoutAnchor);
  const [showCarInfo, setShowCarInfo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mode, setMode } = useContext(ThemeModeContext);

  // Determine video source - use car video if exists, otherwise default
  const getVideoSource = () => {
    if (trendingCar?.carVideos && trendingCar.carVideos.length > 0) {
      return `${REACT_APP_API_URL}/${trendingCar.carVideos[0]}`;
    }
    return "/img/video/default-car.mp4";
  };

  /** LIFECYCLES **/
  useEffect(() => {
    setMounted(true);
    // Restore saved language from localStorage after mount
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("locale");
      if (savedLang && savedLang !== router.locale) {
        // If saved language differs from router locale, update the route
        router.replace(router.asPath, router.asPath, {
          locale: savedLang,
          shallow: true,
        });
        setLang(savedLang);
      }
    }
  }, []); // Run only once on mount

  // Update language when router locale changes (when user switches language)
  useEffect(() => {
    if (router.locale && router.locale !== lang) {
      setLang(router.locale);
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", router.locale);
      }
    }
  }, [router.locale]);

  useEffect(() => {
    switch (router.pathname) {
      case "/car/detail":
        setBgColor(true);
        break;
      default:
        break;
    }
  }, [router]);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;

      const handleCanPlay = () => {
        videoElement.play().catch(() => {
          // Video autoplay blocked by browser - expected behavior
        });
      };

      videoElement.addEventListener("canplay", handleCanPlay);
      videoElement.load();

      return () => {
        videoElement.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [trendingCar]);

  /** HANDLERS **/
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
      await router.push(router.asPath, router.asPath, { locale: e.target.id });
    },
    [router]
  );

  const changeNavbarColor = () => {
    if (window.scrollY >= 50) {
      setColorChange(true);
    } else {
      setColorChange(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHover = (event: any) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

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

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", changeNavbarColor);
  }

  // helper to rotate modes
  const nextMode = useCallback((): ThemeMode => {
    if (mode === "light") return "elevatedDark";
    if (mode === "elevatedDark") return "dark";
    return "light";
  }, [mode]);

  if (device == "mobile") {
    return (
      <Stack className={"top"}>
        <Link href={"/"}>
          <div suppressHydrationWarning>{t("Home")}</div>
        </Link>
        <Link href={"/car"}>
          <div suppressHydrationWarning>{t("Cars")}</div>
        </Link>
        <Link href={"/agent"}>
          <div suppressHydrationWarning>{t("Agents")}</div>
        </Link>
        <Link href={"/community?articleCategory=FREE"}>
          <div suppressHydrationWarning>{t("Community")}</div>
        </Link>
        <Link href={"/cs"}>
          <div suppressHydrationWarning>{t("CS")}</div>
        </Link>
      </Stack>
    );
  } else {
    return (
      <Stack className={"navbar"}>
        <Box
          className="video-background"
          onMouseEnter={() => {
            setShowCarInfo(true);
          }}
          onMouseLeave={() => {
            setShowCarInfo(false);
          }}
        >
          <video
            ref={videoRef}
            className="background-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={getVideoSource()} type="video/mp4" />
          </video>
          <div className="video-overlay" />

          {trendingCar && (
            <Box
              className={`car-info-overlay ${showCarInfo ? "visible" : ""}`}
              sx={{
                position: "absolute",
                bottom: "40px",
                left: "40px",
                maxWidth: "500px",
                color: "white",
                zIndex: 15,
                pointerEvents: "none",
                visibility: mounted ? "visible" : "hidden",
              }}
              suppressHydrationWarning
            >
              <Box className="luxury-badge" suppressHydrationWarning>
                <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" suppressHydrationWarning>
                  {t("car.featured")}
                </Typography>
              </Box>

              <Typography
                variant="h3"
                className="car-title"
                suppressHydrationWarning
              >
                {trendingCar.carTitle}
              </Typography>

              <Typography
                variant="body1"
                className="car-desc"
                suppressHydrationWarning
              >
                {trendingCar.carDesc || t("car.defaultDesc")}
              </Typography>

              <Box className="car-details">
                <Box className="detail-item">
                  <CalendarTodayIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{trendingCar.carYear}</Typography>
                </Box>
                <Box className="detail-divider" />
                <Box className="detail-item">
                  <EventSeatIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" suppressHydrationWarning>
                    {trendingCar.carSeats} {t("car.seatsLabel")}
                  </Typography>
                </Box>
                <Box className="detail-divider" />
                <Box className="detail-item">
                  <SpeedIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" suppressHydrationWarning>
                    {trendingCar.carMileage.toLocaleString("en-US")}{" "}
                    {t("car.km")}
                  </Typography>
                </Box>
              </Box>

              <Box className="car-price-container">
                <Box className="price-wrapper">
                  <Typography
                    variant="caption"
                    className="price-label"
                    suppressHydrationWarning
                  >
                    {t("car.startingFrom")}
                  </Typography>
                  <Typography
                    variant="h4"
                    className="car-price"
                    suppressHydrationWarning
                  >
                    ${trendingCar.carPrice.toLocaleString("en-US")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Stack
          className={`navbar-main ${colorChange ? "transpalease" : ""} ${
            bgColor ? "transpalease" : ""
          }`}
          sx={{ pointerEvents: "none" }}
        >
          <Stack className={"container"} sx={{ pointerEvents: "auto" }}>
            <Box component={"div"} className={"logo-box"}>
              <Link href={"/"}>
                <img src="/img/logo/ucar_logo (1).svg" alt="" />
              </Link>
            </Box>

            <Box component={"div"} className={"user-box"}>
              {/* theme toggle */}
              {mounted && (
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
              )}

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
                    <MenuItem onClick={() => logOut()} suppressHydrationWarning>
                      <Logout
                        fontSize="small"
                        style={{ color: "blue", marginRight: "10px" }}
                      />
                      {t("mypage.logout")}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Link href={"/account/join"}>
                  <div className={"join-box"}>
                    <AccountCircleOutlinedIcon />
                    <span suppressHydrationWarning>
                      {t("Login")} / {t("Register")}
                    </span>
                  </div>
                </Link>
              )}

              <div className={"lan-box"}>
                {user?._id && (
                  <NotificationsOutlinedIcon className={"notification-icon"} />
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
                    <img
                      src={`/img/flag/lang${router.locale || "en"}.png`}
                      alt={"flag"}
                    />
                  </Box>
                </Button>

                <StyledMenu
                  anchorEl={anchorEl2}
                  open={drop}
                  onClose={langClose}
                >
                  <MenuItem
                    disableRipple
                    onClick={langChoice}
                    id="en"
                    suppressHydrationWarning
                  >
                    <img
                      className="img-flag"
                      src={"/img/flag/langen.png"}
                      onClick={langChoice}
                      id="en"
                      alt={"usaFlag"}
                    />
                    {t("English")}
                  </MenuItem>
                  <MenuItem
                    disableRipple
                    onClick={langChoice}
                    id="kr"
                    suppressHydrationWarning
                  >
                    <img
                      className="img-flag"
                      src={"/img/flag/langkr.png"}
                      onClick={langChoice}
                      id="uz"
                      alt={"koreanFlag"}
                    />
                    {t("Korean")}
                  </MenuItem>
                  <MenuItem
                    disableRipple
                    onClick={langChoice}
                    id="ru"
                    suppressHydrationWarning
                  >
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
          <Box
            className={`motto-box ${showCarInfo ? "hidden" : ""}`}
            sx={{
              pointerEvents: "auto",
              visibility: mounted ? "visible" : "hidden",
            }}
            suppressHydrationWarning
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                fontSize: { xs: "4rem", md: "6rem" },
                mb: 2,
                whiteSpace: "pre-line",
              }}
              suppressHydrationWarning
            >
              {t("hero.title")}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: "white",
                textAlign: "center",
                fontWeight: 400,
                fontSize: { xs: "1.1rem", md: "1.5rem" },
                opacity: 0.9,
                maxWidth: "800px",
                mx: "auto",
                mb: 3,
                whiteSpace: "pre-line",
              }}
              suppressHydrationWarning
            >
              {t("hero.subtitle")}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    );
  }
};

export default Top;
