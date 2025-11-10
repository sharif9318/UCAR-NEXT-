import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Stack, Box, Typography } from "@mui/material";
import useDeviceDetect from "../hooks/useDeviceDetect";
import Link from "next/link";
import { REACT_APP_API_URL } from "../config";
import { Car } from "../types/car/car";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

interface TopProps {
  trendingCar?: Car;
}

const Top = ({ trendingCar }: TopProps) => {
  const device = useDeviceDetect();
  const { t } = useTranslation("common");
  const router = useRouter();
  const [colorChange, setColorChange] = useState(false);
  const [bgColor, setBgColor] = useState(false);
  const [showCarInfo, setShowCarInfo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
  }, []);

  useEffect(() => {
    setBgColor(router.pathname === "/car/detail");
  }, [router.pathname]);

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

  useEffect(() => {
    const changeNavbarColor = () => {
      setColorChange(window.scrollY >= 50);
    };

    window.addEventListener("scroll", changeNavbarColor);
    return () => window.removeEventListener("scroll", changeNavbarColor);
  }, []);

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
