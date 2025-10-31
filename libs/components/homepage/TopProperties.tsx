import React, { useState } from "react";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectCoverflow } from "swiper";
import TopPropertyCard from "./TopPropertyCard";
import { PropertiesInquiry } from "../../types/property/property.input";
import { Property } from "../../types/property/property";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROPERTIES } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { LIKE_TARGET_PROPERTY } from "../../../apollo/user/mutation";
import { Message } from "../../enums/common.enum";
import {
  sweetTopSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "../../sweetAlert";

interface TopPropertiesProps {
  initialInput: PropertiesInquiry;
  onPropertiesLoaded?: (property: Property | undefined) => void;
}

const TopProperties = (props: TopPropertiesProps) => {
  const { initialInput, onPropertiesLoaded } = props;
  const device = useDeviceDetect();
  const [topProperties, setTopProperties] = useState<Property[]>([]);

  /** APOLLO REQUESTS **/

  const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_PROPERTIES, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTopProperties(data?.getProperties?.list);

      if (onPropertiesLoaded && topProperties?.length > 0) {
        const propertiesWithVideo = topProperties.filter((prop: Property) =>
          prop.propertyImages?.some(
            (img) =>
              img.includes(".mp4") ||
              img.includes(".webm") ||
              img.includes(".mov")
          )
        );

        if (propertiesWithVideo.length > 0) {
          const sortedVideoProperties = propertiesWithVideo.sort(
            (a: Property, b: Property) =>
              (b.propertyLikes || 0) - (a.propertyLikes || 0)
          );

          const currentIndex = parseInt(
            localStorage.getItem("videoRotationIndex") || "0"
          );

          const selectedProperty =
            sortedVideoProperties[currentIndex % sortedVideoProperties.length];

          localStorage.setItem(
            "videoRotationIndex",
            ((currentIndex + 1) % sortedVideoProperties.length).toString()
          );

          onPropertiesLoaded(selectedProperty);
        } else {
          onPropertiesLoaded(topProperties[0]);
        }
      }
    },
  });

  /* HANDLERS */
  const likePropertyHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await likeTargetProperty({
        variables: { input: id },
      });
      await getPropertiesRefetch({ input: initialInput });

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("ERROR, likePropertyHandler:", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === "mobile") {
    return (
      <Stack className={"top-properties"}>
        <Stack className={"container"}>
          <Stack className={"info-box"}>
            <span>Top properties</span>
          </Stack>
          <Stack className={"card-box"}>
            <Swiper
              className={"top-property-swiper"}
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
              {topProperties.map((property: Property) => {
                return (
                  <SwiperSlide
                    className={"top-property-slide"}
                    key={property?._id}
                  >
                    <TopPropertyCard
                      property={property}
                      likePropertyHandler={likePropertyHandler}
                    />
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
              className={"top-property-swiper"}
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
              {topProperties.map((property: Property) => {
                return (
                  <SwiperSlide
                    className={"top-property-slide"}
                    key={property?._id}
                  >
                    <TopPropertyCard
                      property={property}
                      likePropertyHandler={likePropertyHandler}
                    />
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

TopProperties.defaultProps = {
  initialInput: {
    page: 1,
    limit: 8,
    sort: "propertyRank",
    direction: "DESC",
    search: {},
  },
};

export default TopProperties;
