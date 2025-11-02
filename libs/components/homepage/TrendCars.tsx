import React, { useState } from "react";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { Car } from "../../types/car/car";
import { CarsInquiry } from "../../types/car/car.input";
import TrendCarCard from "./TrendCarCard";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CARS } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { LIKE_TARGET_CAR } from "../../../apollo/user/mutation";
import {
  sweetTopSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "../../sweetAlert";
import { Message } from "../../enums/common.enum";

interface TrendCarsProps {
  initialInput: CarsInquiry;
  onCarsLoaded?: (car: Car | undefined) => void;
}

const TrendCars = (props: TrendCarsProps) => {
  const { initialInput, onCarsLoaded } = props;
  const device = useDeviceDetect();
  const [trendCars, setTrendCars] = useState<Car[]>([]);

  /** APOLLO REQUESTS **/
  const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

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
      const cars = data?.getCars?.list;
      console.log("All cars loaded:", cars);
      setTrendCars(cars);

      if (onCarsLoaded && cars?.length > 0) {
        const carsWithVideo = cars.filter((car: Car) =>
          car.carImages?.some(
            (img) =>
              img.includes(".mp4") ||
              img.includes(".webm") ||
              img.includes(".mov")
          )
        );

        if (carsWithVideo.length > 0) {
          const sortedVideoCars = carsWithVideo.sort(
            (a: Car, b: Car) =>
              (b.carLikes || 0) - (a.carLikes || 0)
          );

          const currentIndex = parseInt(
            localStorage.getItem("videoRotationIndex") || "0"
          );

          const selectedCar =
            sortedVideoCars[currentIndex % sortedVideoCars.length];

          localStorage.setItem(
            "videoRotationIndex",
            ((currentIndex + 1) % sortedVideoCars.length).toString()
          );

          onCarsLoaded(selectedCar);
        } else {
          onCarsLoaded(cars[0]);
        }
      }
    },
  });

  /* HANDLERS ***/
  const likeCarHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await likeTargetCar({
        variables: { input: id },
      });

      await getCarsRefetch({ input: initialInput });

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("ERROR, likeCarHandler:", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === "mobile") {
    return (
      <Stack className={"trend-properties"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>Trend Cars</span>
          </Stack>
          <Stack className={"card-box"}>
            {trendCars.length === 0 ? (
              <Box component={"div"} className={"empty-list"}>
                Trends Empty
              </Box>
            ) : (
              <Swiper
                className={"trend-property-swiper"}
                slidesPerView={"auto"}
                centeredSlides={true}
                spaceBetween={15}
                modules={[Autoplay]}
              >
                {trendCars.map((car: Car, index: number) => {
                  return (
                    <SwiperSlide
                      key={car._id}
                      className={"trend-car-slide"}
                    >
                      <TrendCarCard
                        car={car}
                        likeCarHandler={likeCarHandler}
                        index={index}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"trend-properties"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <Box component={"div"} className={"left"}>
              <span>The Like-Driven Garage</span>
              <p>
                These aren't just cars, they're the community's favorites. Every
                'like' is a vote, and this is the hall of fame. <br />
                Scroll through the rides that are capturing hearts and turning
                heads right now.
              </p>
            </Box>
            <Box component={"div"} className={"right"}>
              <div className={"pagination-box"}>
                <WestIcon className={"swiper-trend-prev"} />
                <div className={"swiper-trend-pagination"}></div>
                <EastIcon className={"swiper-trend-next"} />
              </div>
            </Box>
          </Stack>
          <Stack className={"card-box"}>
            {trendCars.length === 0 ? (
              <Box component={"div"} className={"empty-list"}>
                Trends Empty
              </Box>
            ) : (
              <Swiper
                className={"trend-property-swiper"}
                slidesPerView={"auto"}
                spaceBetween={15}
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{
                  nextEl: ".swiper-trend-next",
                  prevEl: ".swiper-trend-prev",
                }}
                pagination={{
                  el: ".swiper-trend-pagination",
                }}
              >
                {trendCars.map((car: Car, index: number) => {
                  return (
                    <SwiperSlide
                      key={car._id}
                      className={"trend-car-slide"}
                    >
                      <TrendCarCard
                        car={car}
                        likeCarHandler={likeCarHandler}
                        index={index}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

TrendCars.defaultProps = {
  initialInput: {
    page: 1,
    limit: 8,
    sort: "carLikes",
    direction: "DESC",
    search: {},
  },
};

export default TrendCars;
