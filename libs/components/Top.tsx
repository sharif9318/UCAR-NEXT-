import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Stack, Box, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import useDeviceDetect from "../hooks/useDeviceDetect";
import Link from "next/link";
import { REACT_APP_API_URL } from "../config";
import { Car } from "../types/car/car";

interface TopProps {
  trendingCar?: Car;
}

const MobileNavigation: React.FC = () => {
  const { t } = useTranslation("common");

  const navLinks = [
    { href: "/", label: t("Home") },
    { href: "/car", label: t("Cars") },
    { href: "/agent", label: t("Agents") },
    { href: "/community?articleCategory=FREE", label: t("Community") },
    { href: "/cs", label: t("CS") },
  ];

  return (
    <Stack className="top">
      {navLinks.map(({ href, label }) => (
        <Link key={href} href={href}>
          <div suppressHydrationWarning>{label}</div>
        </Link>
      ))}
    </Stack>
  );
};

interface CarDetailsProps {
  car: Car;
  onNavigate: (carId: string) => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({ car, onNavigate }) => {
  const { t } = useTranslation("common");

  const details = [
    { icon: CalendarTodayIcon, value: car.carYear },
    { icon: EventSeatIcon, value: `${car.carSeats} ${t("car.seatsLabel")}` },
    {
      icon: SpeedIcon,
      value: `${car.carMileage.toLocaleString("en-US")} ${t("car.km")}`,
    },
  ];

  const handleClick = (e: React.MouseEvent) => {
    console.log("CarDetails clicked!", car._id);
    e.preventDefault();
    e.stopPropagation();

    if (car._id) {
      onNavigate(car._id);
    } else {
      console.error("Car _id is missing:", car);
    }
  };

  return (
    <Box
      onClick={handleClick}
      onMouseDown={(e) => console.log("Mouse down on CarDetails")}
      suppressHydrationWarning
      sx={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          opacity: 0.9,
          transform: "scale(1.02)",
        },
        // Ensure the box captures clicks
        position: "relative",
        zIndex: "10001 !important",
        userSelect: "none",
      }}
    >
      <Box
        className="car-tag"
        sx={{ display: "flex", alignItems: "center", mb: 1 }}
      >
        <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5 }} />
        <Typography variant="caption" suppressHydrationWarning>
          {t("car.featured")}
        </Typography>
      </Box>

      <Typography variant="h3" className="car-title" suppressHydrationWarning>
        {car.carTitle}
      </Typography>

      <Typography variant="body1" className="car-desc" suppressHydrationWarning>
        {car.carDesc || t("car.defaultDesc")}
      </Typography>

      <Box className="car-details">
        {details.map(({ icon: Icon, value }, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Box className="detail-divider" />}
            <Box className="detail-item">
              <Icon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{value}</Typography>
            </Box>
          </React.Fragment>
        ))}
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
            ${car.carPrice.toLocaleString("en-US")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

interface HeroContentProps {
  isVisible: boolean;
  isMounted: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({ isVisible, isMounted }) => {
  const { t } = useTranslation("common");

  return (
    <Box
      className={`motto-box ${isVisible ? "" : "hidden"}`}
      sx={{
        pointerEvents: isVisible ? "auto" : "none",
        visibility: isMounted ? "visible" : "hidden",
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
  );
};

const Top: React.FC<TopProps> = ({ trendingCar }) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [colorChange, setColorChange] = useState(false);
  const [bgColor, setBgColor] = useState(false);
  const [showCarInfo, setShowCarInfo] = useState(false);
  const [mounted, setMounted] = useState(false);

  const getVideoSource = (): string => {
    if (trendingCar?.carVideos?.length) {
      return `${REACT_APP_API_URL}/${trendingCar.carVideos[0]}`;
    }
    return "/img/video/default-car.mp4";
  };

  const pushDetailHandler = (carId: string) => {
    console.log("pushDetailHandler called with:", carId);

    if (!carId) {
      return;
    }

    router
      .push({
        pathname: "/car/detail",
        query: { id: carId },
      })
      .then(() => {})
      .catch((error) => {});
  };

  useEffect(() => {
    setMounted(true);

    if (trendingCar) {
      setTimeout(() => {
        const overlay = document.querySelector(".car-info-overlay");
        if (overlay) {
          console.log("Car overlay element:", overlay);
          console.log(
            "Car overlay computed z-index:",
            window.getComputedStyle(overlay).zIndex
          );
          console.log(
            "Car overlay pointer-events:",
            window.getComputedStyle(overlay).pointerEvents
          );
        }
      }, 1000);
    }
  }, [trendingCar]);

  useEffect(() => {
    setBgColor(router.pathname === "/car/detail");
  }, [router.pathname]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      videoElement.play().catch(() => {});
    };

    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.load();

    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay);
    };
  }, [trendingCar]);

  useEffect(() => {
    const handleScroll = () => {
      setColorChange(window.scrollY >= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (device === "mobile") {
    return <MobileNavigation />;
  }

  return (
    <Stack className="navbar" sx={{ position: "relative", zIndex: 1 }}>
      <Box
        className="video-background"
        onMouseEnter={() => setShowCarInfo(true)}
        onMouseLeave={() => setShowCarInfo(false)}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
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
        <div className="video-overlay" style={{ pointerEvents: "none" }} />

        {trendingCar && trendingCar._id && (
          <Box
            key={trendingCar._id}
            className={`car-info-overlay ${showCarInfo ? "visible" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            sx={{
              position: "absolute !important",
              bottom: "40px !important",
              left: "40px !important",
              maxWidth: "500px",
              color: "white",
              zIndex: "10000 !important",
              pointerEvents: "auto !important",
              visibility: mounted ? "visible" : "hidden",
              opacity: showCarInfo ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <CarDetails car={trendingCar} onNavigate={pushDetailHandler} />
          </Box>
        )}
      </Box>

      <Stack
        className={`navbar-main ${
          colorChange || bgColor ? "transpalease" : ""
        }`}
        sx={{ pointerEvents: "none", position: "relative", zIndex: 1 }}
      >
        <Stack className="container" sx={{ pointerEvents: "auto" }}>
          <Box component="div" className="logo-box">
            <Link href="/">
              <img src="/img/logo/ucar_logo (1).svg" alt="UCar Logo" />
            </Link>
          </Box>
        </Stack>
        <HeroContent isVisible={!showCarInfo} isMounted={mounted} />
      </Stack>
    </Stack>
  );
};

export default Top;
