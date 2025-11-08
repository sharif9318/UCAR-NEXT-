import React from "react";
import { Stack, Box, Skeleton, useTheme } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useQuery } from "@apollo/client";
import { GET_FEATURED_ARTICLES } from "../../../apollo/user/query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "next-i18next";

interface EventData {
  eventTitle: string;
  city: string;
  description: string;
  imageSrc: string;
}

type FeaturedArticle = {
  _id: string;
  source: "FORBES" | "NYTIMES" | "BLOOMBERG" | string;
  title: string;
  url: string;
  summary?: string;
  imageUrl?: string;
  publishedAt?: string;
};

const EventCard = ({ event }: { event: EventData }) => {
  const device = useDeviceDetect();
  const theme = useTheme();

  // Theme-aware styles
  const cardStyles = {
    backgroundImage: `url(${event?.imageSrc})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative" as const,
    overflow: "hidden",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 8px 24px rgba(0,0,0,0.6)"
          : "0 8px 24px rgba(0,0,0,0.15)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        theme.palette.mode === "dark"
          ? "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)"
          : "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
      zIndex: 1,
    },
  };

  const infoStyles = {
    position: "relative" as const,
    zIndex: 2,
    padding: theme.spacing(2),
    color: theme.palette.common.white,
    "& strong": {
      display: "block",
      fontSize: "14px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      marginBottom: theme.spacing(0.5),
      color: theme.palette.mode === "dark" ? "#60A5FA" : "#93C5FD",
    },
    "& span": {
      display: "block",
      fontSize: "20px",
      fontWeight: 700,
      lineHeight: 1.3,
    },
  };

  const moreStyles = {
    position: "relative" as const,
    zIndex: 2,
    padding: theme.spacing(2),
    paddingTop: 0,
    color: theme.palette.common.white,
    "& span": {
      fontSize: "14px",
      lineHeight: 1.6,
      opacity: 0.9,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical" as const,
      overflow: "hidden",
    },
  };

  if (device === "mobile") {
    return (
      <Stack
        className="event-card-mobile"
        sx={{
          ...cardStyles,
          minHeight: "250px",
        }}
      >
        <Box component={"div"} sx={infoStyles}>
          <strong>{event?.city}</strong>
          <span>{event?.eventTitle}</span>
        </Box>
        <Box component={"div"} sx={moreStyles}>
          <span>{event?.description}</span>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack
        className="event-card"
        sx={{
          ...cardStyles,
          minHeight: "320px",
        }}
      >
        <Box component={"div"} sx={infoStyles}>
          <strong>{event?.city}</strong>
          <span>{event?.eventTitle}</span>
        </Box>
        <Box component={"div"} sx={moreStyles}>
          <span>{event?.description}</span>
        </Box>
      </Stack>
    );
  }
};

const EventSkeleton = () => {
  const theme = useTheme();

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={250}
        sx={{
          borderRadius: "12px",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.08)",
        }}
      />
      <Skeleton
        variant="text"
        width="60%"
        sx={{
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.08)",
        }}
      />
      <Skeleton
        variant="text"
        width="80%"
        sx={{
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.08)",
        }}
      />
    </Stack>
  );
};

const Events = () => {
  const device = useDeviceDetect();
  const theme = useTheme();
  const { data, loading, error } = useQuery(GET_FEATURED_ARTICLES, {
    variables: { limit: 10 },
    fetchPolicy: "cache-and-network",
  });
  const { t } = useTranslation("common");

  // Transform backend data to EventData format
  const featuredCards: EventData[] = React.useMemo(() => {
    const list: FeaturedArticle[] = data?.featuredArticles?.list || [];
    return list
      .filter((article) => article.imageUrl && article.title)
      .map((article) => ({
        eventTitle: article.title,
        city:
          article.source?.toString().toLowerCase() === "nytimes"
            ? "NYTimes"
            : article.source || "Featured",
        description: article.summary || article.title,
        imageSrc: article.imageUrl as string,
      }));
  }, [data]);

  // Theme-aware container styles
  const containerStyles = {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.paper
        : theme.palette.grey[50],
    padding: theme.spacing(6, 2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(8, 4),
    },
  };

  const infoBoxStyles = {
    marginBottom: theme.spacing(4),
    "& span": {
      fontSize: "32px",
      fontWeight: 700,
      color:
        theme.palette.mode === "dark"
          ? theme.palette.common.white
          : theme.palette.text.primary,
      display: "block",
      marginBottom: theme.spacing(1),
    },
    "& p": {
      fontSize: "16px",
      color:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.7)"
          : theme.palette.text.secondary,
      margin: 0,
    },
  };

  const emptyStateStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 250,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.02)",
    borderRadius: "12px",
    border: `2px dashed ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)"
    }`,
    padding: theme.spacing(4),
    transition: "all 0.3s ease",
  };

  const emptyStateTextStyles = {
    color:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.6)"
        : "rgba(0,0,0,0.5)",
    fontSize: "16px",
    textAlign: "center" as const,
    lineHeight: 1.6,
  };

  // Show loading state
  if (loading && !data) {
    return (
      <Stack className={"events"} sx={containerStyles}>
        <Stack
          className={"container"}
          sx={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}
        >
          <Stack className={"info-box"} sx={infoBoxStyles}>
            <Box component={"div"} className={"left"}>
              <span>{t("events.title")}</span>
              <p>{t("events.desc")}</p>
            </Box>
          </Stack>
          <Box className={"card-wrapper"}>
            <Stack direction="row" spacing={2} sx={{ overflowX: "hidden" }}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ flex: "0 0 300px" }}>
                  <EventSkeleton />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    );
  }

  // Show error state
  if (error) {
    return (
      <Stack className={"events"} sx={containerStyles}>
        <Stack
          className={"container"}
          sx={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}
        >
          <Stack className={"info-box"} sx={infoBoxStyles}>
            <Box component={"div"} className={"left"}>
              <span>{t("events.title")}</span>
              <p
                style={{
                  color: theme.palette.mode === "dark" ? "#EF4444" : "#DC2626",
                }}
              >
                {t(
                  "events.errorMessage",
                  "Unable to load events at this time. Please try again later."
                )}
              </p>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  // Show empty state if no events from backend
  if (featuredCards.length === 0) {
    return (
      <Stack className={"events"} sx={containerStyles}>
        <Stack
          className={"container"}
          sx={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}
        >
          <Stack className={"info-box"} sx={infoBoxStyles}>
            <Box component={"div"} className={"left"}>
              <span>{t("events.title")}</span>
              <p>{t("events.desc")}</p>
            </Box>
          </Stack>
          <Box className={"card-wrapper"}>
            <Box sx={emptyStateStyles}>
              <Stack alignItems="center" spacing={2}>
                <span style={{ fontSize: "48px", opacity: 0.5 }}>📅</span>
                <p style={emptyStateTextStyles}>
                  {t(
                    "events.noEventsMessage",
                    "No featured events available at this time. Check back soon!"
                  )}
                </p>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Stack>
    );
  }

  // Custom Swiper navigation styles based on theme
  const swiperStyles = {
    "& .swiper-button-next, & .swiper-button-prev": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.common.white
          : theme.palette.primary.main,
      "&::after": {
        fontSize: "24px",
      },
    },
    "& .swiper-button-next:hover, & .swiper-button-prev:hover": {
      color:
        theme.palette.mode === "dark" ? "#60A5FA" : theme.palette.primary.dark,
    },
    "& .swiper-pagination-bullet": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.3)"
          : "rgba(0,0,0,0.3)",
      opacity: 1,
    },
    "& .swiper-pagination-bullet-active": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.palette.common.white
          : theme.palette.primary.main,
    },
  };

  if (device === "mobile") {
    return (
      <Stack className={"events"} sx={containerStyles}>
        <Stack
          className={"container"}
          sx={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}
        >
          <Stack className={"info-box"} sx={infoBoxStyles}>
            <Box component={"div"} className={"left"}>
              <span>{t("events.title")}</span>
              <p>{t("events.desc")}</p>
            </Box>
          </Stack>
          <Box className={"card-wrapper"} sx={swiperStyles}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={15}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={featuredCards.length > 1}
            >
              {featuredCards.map((event: EventData, index: number) => (
                <SwiperSlide key={`${event?.eventTitle}-${index}`}>
                  <EventCard event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"events"} sx={containerStyles}>
        <Stack
          className={"container"}
          sx={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}
        >
          <Stack className={"info-box"} sx={infoBoxStyles}>
            <Box component={"div"} className={"left"}>
              <span>{t("events.title")}</span>
              <p>{t("events.desc")}</p>
            </Box>
          </Stack>
          <Box className={"card-wrapper"} sx={swiperStyles}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1440: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              loop={featuredCards.length > 4}
            >
              {featuredCards.map((event: EventData, index: number) => (
                <SwiperSlide key={`${event?.eventTitle}-${index}`}>
                  <EventCard event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Stack>
      </Stack>
    );
  }
};

export default Events;
