import React, { useEffect, useState } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import { Stack } from "@mui/material";
import HeaderFilter from "../homepage/HeaderFilter";
import { userVar } from "../../../apollo/store";
import { useReactiveVar } from "@apollo/client";
import { getJwtToken, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import InteractiveNavbar from "../InteractiveNavbar";
import { Car } from "../../types/car/car";

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();
    const user = useReactiveVar(userVar);
    const [trendingCar, setTrendingCar] = useState<Car | undefined>();

    /** LIFECYCLES **/
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    /** HANDLERS **/

    if (device == "mobile") {
      return (
        <>
          <Head>
            <title>Nestar</title>
            <meta name={"title"} content={`Nestar`} />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id={"top"}>
              <Top {...props} trendingCar={trendingCar} />
            </Stack>

            <Stack id={"main"}>
              <Component {...props} setTrendingCar={setTrendingCar} />
            </Stack>

            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    } else {
      return (
        <>
          <Head>
            <title>UCAR NEXT</title>
            <meta name={"title"} content={`UCAR NEXT`} />
          </Head>
          <Stack id="pc-wrap">
            <Stack id={"top"}>
              <Top {...props} trendingCar={trendingCar} />
            </Stack>
            <Stack className={"InteractiveNavbar"}>
              <InteractiveNavbar />
            </Stack>

            <Stack id={"main"}>
              <Component {...props} setTrendingCar={setTrendingCar} />
            </Stack>

            <Chat />

            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    }
  };
};

export default withLayoutMain;
