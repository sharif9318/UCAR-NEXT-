import { NextPage } from "next";
import { useState } from "react";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import CommunityBoards from "../libs/components/homepage/CommunityBoards";
import PopularCars from "../libs/components/homepage/PopularCars";
import TopAgents from "../libs/components/homepage/TopAgents";
import Events from "../libs/components/homepage/Events";
import TrendCars from "../libs/components/homepage/TrendCars";
import TopCars from "../libs/components/homepage/TopCars";
import { Stack } from "@mui/material";
import Advertisement from "../libs/components/homepage/Advertisement";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Car } from "../libs/types/car/car";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = (props: any) => {
  const device = useDeviceDetect();
  const { setTrendingCar } = props;

  const handleCarsLoaded = (car: Car | undefined) => {
    console.log("handleCarsLoaded called with:", car);
    if (setTrendingCar) {
      setTrendingCar(car);
    }
  };

  if (device === "mobile") {
    return (
      <Stack className={"home-page"}>
        <TrendCars onCarsLoaded={handleCarsLoaded} />
        <PopularCars />
        <Advertisement />
        <TopCars />
        <TopAgents />
      </Stack>
    );
  } else {
    return (
      <Stack className={"home-page"}>
        <TrendCars onCarsLoaded={handleCarsLoaded} />
        <PopularCars />
        <Advertisement />
        <TopCars />
        <TopAgents />
        <Events />
        <CommunityBoards />
      </Stack>
    );
  }
};

export default withLayoutMain(Home);
