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

  if (device === "mobile") {
    return (
      <Stack className="event-card event-card-mobile">
        <Box component="div" className="card-img">
          <div
            className="card-image"
            style={{ backgroundImage: `url(${event?.imageSrc})` }}
          />
          <Box component="div" className="info">
            <strong>{event?.city}</strong>
            <span>{event?.eventTitle}</span>
          </Box>
          <Box component="div" className="more">
            <span>{event?.description}</span>
          </Box>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack className="event-card">
      <Box component="div" className="card-img">
        <div
          className="card-image"
          style={{ backgroundImage: `url(${event?.imageSrc})` }}
        />
        <Box component="div" className="info">
          <strong>{event?.city}</strong>
          <span>{event?.eventTitle}</span>
        </Box>
        <Box component="div" className="more">
          <span>{event?.description}</span>
        </Box>
      </Box>
    </Stack>
  );
};

const EventSkeleton = () => {
  return (
    <Stack spacing={2} className="event-skeleton">
      <Skeleton
        variant="rectangular"
        width="100%"
        height={350}
        className="skeleton-card"
      />
      <Skeleton variant="text" width="60%" className="skeleton-text" />
      <Skeleton variant="text" width="80%" className="skeleton-text" />
    </Stack>
  );
};

const Events = () => {
  const device = useDeviceDetect();
  const { data, loading, error } = useQuery(GET_FEATURED_ARTICLES, {
    variables: { limit: 10 },
    fetchPolicy: "cache-and-network",
  });
  const { t } = useTranslation("common");

  // Helper function to clean CDATA and HTML entities from text
  const cleanText = (text: string): string => {
    if (!text) return "";

    // Remove CDATA tags: <![CDATA[...]]>
    let cleaned = text.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");

    // Decode HTML entities
    const textarea = document.createElement("textarea");
    textarea.innerHTML = cleaned;
    cleaned = textarea.value;

    // Remove any remaining HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, "");

    return cleaned.trim();
  };

  const featuredCards: EventData[] = React.useMemo(() => {
    const list: FeaturedArticle[] = data?.featuredArticles?.list || [];
    return list
      .filter((article) => article.imageUrl && article.title)
      .map((article) => ({
        eventTitle: cleanText(article.title),
        city:
          article.source?.toString().toLowerCase() === "nytimes"
            ? "NYTimes"
            : article.source || "Featured",
        description: cleanText(article.summary || article.title),
        imageSrc: article.imageUrl as string,
      }));
  }, [data]);

  if (loading && !data) {
    return (
      <Stack className="events">
        <Stack className="container">
          <Stack className="info-box">
            <Box component="div" className="left">
              <span>{t("events.title")}</span>
              <p>{t("events.desc")}</p>
            </Box>
          </Stack>
          <Box className="card-wrapper">
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

  if (error) {
    return (
      <Stack className="events">
        <Stack className="container">
          <Stack className="info-box">
            <Box component="div" className="left">
              <span>{t("events.title")}</span>
              <p className="error-message">
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

  if (featuredCards.length === 0) {
    return (
      <Stack className="events">
        <Stack className="container">
          <Stack className="info-box">
            <Box component="div" className="left">
              <span>{t("events.title")}</span>
              <p>{t("events.desc")}</p>
            </Box>
          </Stack>
          <Box className="card-wrapper">
            <Box className="empty-state">
              <Stack alignItems="center" spacing={2}>
                <span className="empty-icon">📅</span>
                <p className="empty-text">
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

  if (device === "mobile") {
    return (
      <Stack className="events">
        <Stack className="container">
          <Stack className="info-box">
            <Box component="div" className="left">
              <span>{t("events.title")}</span>
              <p>{t("events.desc")}</p>
            </Box>
          </Stack>
          <Box className="card-wrapper">
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
              className="events-swiper"
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

  return (
    <Stack className="events">
      <Stack className="container">
        <Stack className="info-box">
          <Box component="div" className="left">
            <span>{t("events.title")}</span>
            <p>{t("events.desc")}</p>
          </Box>
        </Stack>
        <Box className="card-wrapper">
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
            className="events-swiper"
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
};

export default Events;
