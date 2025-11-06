import React, { useMemo } from "react";
import { Stack, Box } from "@mui/material";
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

const eventsData: EventData[] = [
  {
    eventTitle: "Paradise City Theme Park",
    city: "Incheon",
    description:
      "Experience magic and wonder in Incheon with a visit to the night-themed indoor theme park Wonderbox at Paradise City!",
    imageSrc: "/img/events/INCHEON.webp",
  },
  {
    eventTitle: "Taebaeksan Snow Festival",
    city: "Seoul",
    description:
      "If you have the opportunity to travel to South Korea, do not miss the Taebaeksan Snow Festival!",
    imageSrc: "/img/events/SEOUL.webp",
  },
  {
    eventTitle: "Suseong Lake Event",
    city: "Daegu",
    description:
      "The Suseong Lake Festival is a culture and arts festival held alongside Suseongmot Lake!",
    imageSrc: "/img/events/DAEGU.webp",
  },
  {
    eventTitle: "Sand Festival",
    city: "Busan",
    description:
      "Haeundae Sand Festival, the nation's largest eco-friendly exhibition on sand, is held at Haeundae Beach!",
    imageSrc: "/img/events/BUSAN.webp",
  },
];

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
    return <div>EVENT CARD</div>;
  } else {
    return (
      <Stack
        className="event-card"
        style={{
          backgroundImage: `url(${event?.imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box component={"div"} className={"info"}>
          <strong>{event?.city}</strong>
          <span>{event?.eventTitle}</span>
        </Box>
        <Box component={"div"} className={"more"}>
          <span>{event?.description}</span>
        </Box>
      </Stack>
    );
  }
};

const Events = () => {
  const device = useDeviceDetect();
  const { data } = useQuery(GET_FEATURED_ARTICLES, {
    variables: { limit: 10 },
    fetchPolicy: "cache-and-network",
  });
  const { t } = useTranslation("common");
  const featuredCards: EventData[] = useMemo(() => {
    const list: FeaturedArticle[] = data?.featuredArticles?.list || [];
    const mapped: EventData[] = list
      .filter((a) => a.imageUrl && a.title)
      .map((a) => ({
        eventTitle: a.title,
        city:
          a.source?.toString().toLowerCase() === "nytimes"
            ? "NYTimes"
            : a.source,
        description: a.summary || a.title,
        imageSrc: a.imageUrl as string,
      }));
    return mapped.length > 0 ? mapped : eventsData;
  }, [data]);

  if (device === "mobile") {
    return <div>EVENT CARD</div>;
  } else {
    return (
      <Stack className={"events"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <Box component={"div"} className={"left"}>
              <span className={"white"}>{t("events.title")}</span>
              <p className={"white"}>{t("events.desc")}</p>
            </Box>
          </Stack>
          <Box className={"card-wrapper"}>
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
              {featuredCards.map((event: EventData) => (
                <SwiperSlide key={event?.eventTitle}>
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
