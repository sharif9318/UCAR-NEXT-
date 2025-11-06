import React, { useState } from "react";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import PopularCarCard from "./PopularCarCard";
import { Car } from "../../types/car/car";
import Link from "next/link";
import { CarsInquiry } from "../../types/car/car.input";
import { useQuery } from "@apollo/client";
import { GET_CARS } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { useTranslation } from "next-i18next";

interface PopularCarsProps {
  initialInput: CarsInquiry;
}

const PopularCars = (props: PopularCarsProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const { t } = useTranslation("common");
  const [popularCars, setPopularCars] = useState<Car[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: getCarsLoading,
    data: getCarsData,
    error: getCarsError,
    refetch: getCarsRefetch,
  } = useQuery(GET_CARS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setPopularCars(data?.getCars?.list);
    },
  });

  /** HANDLERS **/

  if (!popularCars) return null;

  if (device === "mobile") {
    return (
      <Stack className={"popular-properties"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>{t("popular.titleMobile")}</span>
          </Stack>
          <Stack className={"card-box"}>
            <Swiper
              className={"popular-car-swiper"}
              slidesPerView={"auto"}
              centeredSlides={true}
              spaceBetween={25}
              modules={[Autoplay]}
            >
              {popularCars.map((car: Car) => {
                return (
                  <SwiperSlide key={car._id} className={"popular-car-slide"}>
                    <PopularCarCard car={car} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack
        className={"popular-cars"}
        sx={(theme) => ({
          background: `radial-gradient(120% 120% at 0% 0%, rgba(229,9,20,0.06) 0%, rgba(16,18,24,0) 40%), ${theme.palette.background.paper}`,
          backgroundSize: "cover !important",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: `1px solid ${
            theme.palette.mode === "light"
              ? "rgba(229, 9, 20, 0.12)"
              : "rgba(229, 9, 20, 0.12)"
          }`,
          borderRadius: "16px",
          boxShadow: `0 0 0 1px rgba(229, 9, 20, 0.04) inset, 0 10px 30px rgba(0,0,0,0.45)`,
          transition: "all 0.3s ease",
          "--accent": theme.palette.primary.main,
          "&:hover": {
            borderColor: theme.palette.primary.main,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 8px 24px rgba(229, 9, 20, 0.15)"
                : "0 8px 24px rgba(229, 9, 20, 0.2)",
            transform: "translateY(-4px)",
          },
        })}
      >
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <Box component={"div"} className={"left"}>
              <span>{t("popular.title")}</span>
              <p>{t("popular.desc")}</p>
            </Box>
            <Box component={"div"} className={"right"}>
              <Stack className={"pagination-box"}>
                <WestIcon className={"swiper-popular-prev"} />
                <div className={"swiper-popular-pagination"}></div>
                <EastIcon className={"swiper-popular-next"} />
              </Stack>
              <div className={"more-box"}>
                <Link href={"/car"}>
                  <p>
                    {t("popular.seeAll")}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7M17 7L7 7M17 7L17 17"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </p>
                </Link>
              </div>
            </Box>
          </Stack>
          <Stack className={"card-box"}>
            <Swiper
              className={"popular-car-swiper"}
              slidesPerView={"auto"}
              spaceBetween={25}
              modules={[Autoplay, Navigation, Pagination]}
              navigation={{
                nextEl: ".swiper-popular-next",
                prevEl: ".swiper-popular-prev",
              }}
              pagination={{
                el: ".swiper-popular-pagination",
              }}
            >
              {popularCars.map((car: Car) => {
                return (
                  <SwiperSlide key={car._id} className={"popular-car-slide"}>
                    <PopularCarCard car={car} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

PopularCars.defaultProps = {
  initialInput: {
    page: 1,
    limit: 7,
    sort: "carViews",
    direction: "DESC",
    search: {},
  },
};

export default PopularCars;
