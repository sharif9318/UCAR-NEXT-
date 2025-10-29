import { NextPage } from "next";
import { useState } from "react";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import CommunityBoards from "../libs/components/homepage/CommunityBoards";
import PopularProperties from "../libs/components/homepage/PopularProperties";
import TopAgents from "../libs/components/homepage/TopAgents";
import Events from "../libs/components/homepage/Events";
import TrendProperties from "../libs/components/homepage/TrendProperties";
import TopProperties from "../libs/components/homepage/TopProperties";
import { Stack } from "@mui/material";
import Advertisement from "../libs/components/homepage/Advertisement";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Property } from "../libs/types/property/property";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = (props: any) => {
  const device = useDeviceDetect();
  const { setTrendingProperty } = props;

  const handlePropertiesLoaded = (property: Property | undefined) => {
    console.log("handlePropertiesLoaded called with:", property);
    if (setTrendingProperty) {
      setTrendingProperty(property);
    }
  };

  if (device === "mobile") {
    return (
      <Stack className={"home-page"}>
        <TrendProperties onPropertiesLoaded={handlePropertiesLoaded} />
        <PopularProperties />
        <Advertisement />
        <TopProperties />
        <TopAgents />
      </Stack>
    );
  } else {
    return (
      <Stack className={"home-page"}>
        <TrendProperties onPropertiesLoaded={handlePropertiesLoaded} />
        <PopularProperties />
        <Advertisement />
        <TopProperties />
        <TopAgents />
        <Events />
        <CommunityBoards />
      </Stack>
    );
  }
};

export default withLayoutMain(Home);
