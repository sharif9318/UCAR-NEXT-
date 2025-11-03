import React, { useState } from "react";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectCoverflow } from "swiper";
import TopCarCard from "./TopCarCard";
import { CarsInquiry } from "../../types/car/car.input";
import { Car } from "../../types/car/car";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CARS } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { LIKE_TARGET_CAR } from "../../../apollo/user/mutation";
import { Message } from "../../enums/common.enum";
import {
  sweetTopSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "../../sweetAlert";

interface TopCarsProps {
  initialInput: CarsInquiry;
  onCarsLoaded?: (car: Car | undefined) => void;
}

const TopCars = (props: TopCarsProps) => {
  const { initialInput, onCarsLoaded } = props;
  const device = useDeviceDetect();
  const [topCars, setTopCars] = useState<Car[]>([]);

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
      setTopCars(data?.getCars?.list);

      if (onCarsLoaded && topCars?.length > 0) {
        const carsWithVideo = topCars.filter((car: Car) =>
          car.carImages?.some(
            (img) =>
              img.includes(".mp4") ||
              img.includes(".webm") ||
              img.includes(".mov")
          )
        );

        if (carsWithVideo.length > 0) {
          const sortedVideoCars = carsWithVideo.sort(
            (a: Car, b: Car) => (b.carLikes || 0) - (a.carLikes || 0)
          );

          const curleaseIndex = parseInt(
            localStorage.getItem("videoRotationIndex") || "0"
          );

          const selectedCar =
            sortedVideoCars[curleaseIndex % sortedVideoCars.length];

          localStorage.setItem(
            "videoRotationIndex",
            ((curleaseIndex + 1) % sortedVideoCars.length).toString()
          );

          onCarsLoaded(selectedCar);
        } else {
          onCarsLoaded(topCars[0]);
        }
      }
    },
  });

  /* HANDLERS */
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
      <Stack className={"top-properties"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>Top cars</span>
          </Stack>
          <Stack className={"card-box"}>
            <Swiper
              className={"top-car-swiper"}
              slidesPerView={"auto"}
              centeredSlides={true}
              spaceBetween={15}
              grabCursor={true}
              effect={"coverflow"}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 150,
                modifier: 1.2,
                slideShadows: true,
              }}
              modules={[Autoplay, EffectCoverflow]}
            >
              {topCars.map((car: Car) => {
                return (
                  <SwiperSlide className={"top-car-slide"} key={car?._id}>
                    <TopCarCard car={car} likeCarHandler={likeCarHandler} />
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
      <Stack className={"top-properties"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <Box component={"div"} className={"left"}>
              <span>Leaderboard</span>
              <p>
                Where popularity meets quality. Cars are ranked by engagement,
                valuing likes twice as much as views.
              </p>
            </Box>
            <Box component={"div"} className={"right"}>
              <div className={"pagination-box"}>
                <WestIcon className={"swiper-top-prev"} />
                <div className={"swiper-top-pagination"}></div>
                <EastIcon className={"swiper-top-next"} />
              </div>
            </Box>
          </Stack>
          <Stack className={"card-box"}>
            <Swiper
              className={"top-car-swiper"}
              slidesPerView={"auto"}
              centeredSlides={true}
              spaceBetween={15}
              grabCursor={true}
              effect={"coverflow"}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 180,
                modifier: 1.25,
                slideShadows: true,
              }}
              modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
              navigation={{
                nextEl: ".swiper-top-next",
                prevEl: ".swiper-top-prev",
              }}
              pagination={{
                el: ".swiper-top-pagination",
              }}
            >
              {topCars.map((car: Car) => {
                return (
                  <SwiperSlide className={"top-car-slide"} key={car?._id}>
                    <TopCarCard car={car} likeCarHandler={likeCarHandler} />
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

TopCars.defaultProps = {
  initialInput: {
    page: 1,
    limit: 8,
    sort: "carRank",
    direction: "DESC",
    search: {},
  },
};

export default TopCars;
