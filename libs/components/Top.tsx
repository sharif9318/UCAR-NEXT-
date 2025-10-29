import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, withRouter } from "next/router";
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
import { Property } from "../types/property/property";
import HeaderFilter from "./homepage/HeaderFilter";
import { Typography } from "@mui/material";

interface TopProps {
  trendingProperty?: Property;
}

const Top = ({ trendingProperty }: TopProps) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [lang, setLang] = useState<string | null>("en");
  const drop = Boolean(anchorEl2);
  const [colorChange, setColorChange] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
  let open = Boolean(anchorEl);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const logoutOpen = Boolean(logoutAnchor);
  const [showPropertyInfo, setShowPropertyInfo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine video source - use property video if exists, otherwise default
  const getVideoSource = () => {
    if (
      trendingProperty?.propertyImages &&
      trendingProperty.propertyImages.length > 0
    ) {
      const firstMedia = trendingProperty.propertyImages[0];
      if (firstMedia.includes(".mp4") || firstMedia.includes(".webm")) {
        return `${REACT_APP_API_URL}/${firstMedia}`;
      }
    }
    return "/img/video/default-property.mp4";
  };

  /** LIFECYCLES **/
  useEffect(() => {
    if (localStorage.getItem("locale") === null) {
      localStorage.setItem("locale", "en");
      setLang("en");
    } else {
      setLang(localStorage.getItem("locale"));
    }
  }, [router]);

  useEffect(() => {
    switch (router.pathname) {
      case "/property/detail":
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
      videoRef.current
        .play()
        .catch((err) => console.log("Video autoplay failed:", err));
    }
  }, [trendingProperty]);

  useEffect(() => {
    console.log("Top component - trendingProperty changed:", trendingProperty);
    if (videoRef.current) {
      const videoSrc = getVideoSource();
      console.log("Attempting to load video:", videoSrc);

      const videoElement = videoRef.current;

      const handleCanPlay = () => {
        videoElement.play().catch((err) => {
          console.log("Video autoplay failed:", err);
        });
      };

      videoElement.addEventListener("canplay", handleCanPlay);
      videoElement.load();

      return () => {
        videoElement.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [trendingProperty]);

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
        padding: "4px 0", // Reduced padding
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

  if (device == "mobile") {
    return (
      <Stack className={"top"}>
        <Link href={"/"}>
          <div>{t("Home")}</div>
        </Link>
        <Link href={"/property"}>
          <div>{t("Properties")}</div>
        </Link>
        <Link href={"/agent"}>
          <div> {t("Agents")} </div>
        </Link>
        <Link href={"/community?articleCategory=FREE"}>
          <div> {t("Community")} </div>
        </Link>
        <Link href={"/cs"}>
          <div> {t("CS")} </div>
        </Link>
      </Stack>
    );
  } else {
    return (
      <Stack className={"navbar"}>
        <Box
          className="video-background"
          onMouseEnter={() => {
            console.log("Mouse entered video background");
            setShowPropertyInfo(true);
          }}
          onMouseLeave={() => {
            console.log("Mouse left video background");
            setShowPropertyInfo(false);
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

          {/* Property Info - Shows on Hover */}
          {trendingProperty && (
            <Box
              className={`property-info-overlay ${
                showPropertyInfo ? "visible" : ""
              }`}
              sx={{
                position: "absolute",
                bottom: "30px",
                left: "30px",
                maxWidth: "450px",
                color: "white",
                zIndex: 15,
                pointerEvents: "none",
              }}
            >
              <h2 className="property-title">
                {trendingProperty.propertyTitle}
              </h2>
              <p className="property-desc">
                {trendingProperty.propertyDesc || "No description available"}
              </p>
              <div className="property-details">
                <span>🛏️ {trendingProperty.propertyBeds} beds</span>
                <span>🚪 {trendingProperty.propertyRooms} rooms</span>
                <span>📏 {trendingProperty.propertySquare} m²</span>
              </div>
              <div className="property-price">
                ${trendingProperty.propertyPrice}
              </div>
            </Box>
          )}
        </Box>

        <Stack
          className={`navbar-main ${colorChange ? "transparent" : ""} ${
            bgColor ? "transparent" : ""
          }`}
          sx={{ pointerEvents: "none" }}
        >
          <Stack className={"container"} sx={{ pointerEvents: "auto" }}>
            <Box component={"div"} className={"logo-box"}>
              <Link href={"/"}>
                <img src="/img/logo/logoWhite.svg" alt="" />
              </Link>
            </Box>

            <Box component={"div"} className={"user-box"}>
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
                    {lang !== null ? (
                      <img src={`/img/flag/lang${lang}.png`} alt={"usaFlag"} />
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
          <Box className={"motto-box"} sx={{ pointerEvents: "auto" }}>
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
            >
              Drive Your Dream {"\n"} Within Reach
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
            >
              Buy and sell pre-loved cars with confidence.{"\n"} Find your
              perfect match from thousands of verified used cars, {"\n"}or sell
              your car fast to qualified buyers.
            </Typography>
          </Box>
        </Stack>
      </Stack>
    );
  }
};

export default withRouter(Top);
