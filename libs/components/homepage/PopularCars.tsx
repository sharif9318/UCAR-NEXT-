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

interface PopularCarsProps {
  initialInput: CarsInquiry;
}

const PopularCars = (props: PopularCarsProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
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
            <span>Popular Cars</span>
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
        className={"popular-properties"}
        sx={{
          backgroundImage:
            "url(/img/banner/arteum-ro-SkKTh9ZyTxU-unsplash.jpg)!important",
          backgroundSize: "cover !important",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: "2px solid #ec1919ff",
          borderRadius: "12px",
          transition: "all 0.3s ease",
          "&:hover": {
            border: "2px solid #667eea",
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)",
            transform: "translateY(-4px)",
          },
        }}
      >
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <Box component={"div"} className={"left"}>
              <span>The Main Attraction</span>
              <p>
                See what's capturing attention. This list updates based on
                real-time view counts.
              </p>
            </Box>
            <Box component={"div"} className={"right"}>
              <div className={"more-box"}>
                <Link href={"/car"}>
                  <p>
                    See All Categories
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
          <Stack className={"pagination-box"}>
            <WestIcon className={"swiper-popular-prev"} />
            <div className={"swiper-popular-pagination"}></div>
            <EastIcon className={"swiper-popular-next"} />
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
