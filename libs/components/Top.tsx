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

// Extracted Mobile Navigation Component
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

// Extracted Car Details Component
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

  return (
    <Box
      onClick={() => car._id && onNavigate(car._id)}
      suppressHydrationWarning
      sx={{ cursor: "pointer" }}
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

// Extracted Hero Content Component
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
        pointerEvents: "auto",
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

// Main Component
const Top: React.FC<TopProps> = ({ trendingCar }) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [colorChange, setColorChange] = useState(false);
  const [bgColor, setBgColor] = useState(false);
  const [showCarInfo, setShowCarInfo] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Utility function to get video source
  const getVideoSource = (): string => {
    if (trendingCar?.carVideos?.length) {
      return `${REACT_APP_API_URL}/${trendingCar.carVideos[0]}`;
    }
    return "/img/video/default-car.mp4";
  };

  // Navigation handler
  const pushDetailHandler = async (carId: string) => {
    await router.push({
      pathname: "/car/detail",
      query: { id: carId },
    });
  };

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Route change effect
  useEffect(() => {
    setBgColor(router.pathname === "/car/detail");
  }, [router.pathname]);

  // Video management effect
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

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
  }, [trendingCar]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setColorChange(window.scrollY >= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile view
  if (device === "mobile") {
    return <MobileNavigation />;
  }

  // Desktop view
  return (
    <Stack className="navbar">
      <Box
        className="video-background"
        onMouseEnter={() => setShowCarInfo(true)}
        onMouseLeave={() => setShowCarInfo(false)}
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
              pointerEvents: "auto",
              visibility: mounted ? "visible" : "hidden",
            }}
          >
            {trendingCar && (
              <CarDetails car={trendingCar} onNavigate={pushDetailHandler} />
            )}
          </Box>
        )}
      </Box>

      <Stack
        className={`navbar-main ${
          colorChange || bgColor ? "transpalease" : ""
        }`}
        sx={{ pointerEvents: "none" }}
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
