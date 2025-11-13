import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Stack } from "@mui/material";
import { useTranslation } from "next-i18next";

import useDeviceDetect from "../../hooks/useDeviceDetect";
import Top from "../Top";
import Footer from "../Footer";
import InteractiveNavbar from "../InteractiveNavbar";
import { getJwtToken, updateUserInfo } from "../../auth";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const PAGE_CONFIG: Record<
  string,
  { title: string; desc: string; bgImage: string; isAuth?: boolean }
> = {
  "/": {
    title: "Home",
    desc: "Browse, filter, and find your perfect car from our curated inventory.",
    bgImage: "/img/banner/header1.svg",
  },
  "/car": {
    title: "Find Your Perfect Car",
    desc: "Browse, filter, and find your perfect car from our curated inventory!",
    bgImage: "/img/banner/header5.jpg",
  },
  "/car/detail": {
    title: "Vehicle Overview",
    desc: "Drive away with total peace of mind in this impeccably maintained vehicle, recently inspected and serviced.",
    bgImage: "/img/banner/carDetail.jpg",
  },
  "/agent": {
    title: "Certified Auto Advisors  ",
    desc: "Work with reliable agents who put your needs first.",
    bgImage: "/img/banner/AgentPage.jpg",
  },
  "/agent/detail": {
    title: "Your Trusted Agent",
    desc: "Discover personalized support and services from the agent you have selected.",
    bgImage: "/img/banner/dealer.jpg",
  },
  "/mypage": {
    title: "My Dashboard ",
    desc: "Access your personal hub for cars, agents, community posts, and account settings.",
    bgImage: "/img/banner/header1.svg",
  },
  "/community": {
    title: "The Social Garage ",
    desc: "Share ideas, discover recommendations, stay informed, and laugh together with our community.",
    bgImage: "/img/banner/community.jpg",
  },
  "/community/detail": {
    title: "Post Details ",
    desc: "Read the full content, explore comments, and join the conversation with the community.",
    bgImage: "/img/banner/comDetail.jpg",
  },
  "/cs": {
    title: "Help Desk",
    desc: "Connect with our team for assistance, troubleshooting, and expert advice anytime you need it.",
    bgImage: "/img/banner/helpDesk.jpg",
  },
  "/account/join": {
    title: "Login/Signup",
    desc: "Authentication Process",
    bgImage: "/img/banner/header2.svg",
    isAuth: true,
  },
  "/member": {
    title: "Member Page",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header1.svg",
  },
};

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const { t } = useTranslation("common");
    const device = useDeviceDetect();

    const pageConfig = useMemo(() => {
      return PAGE_CONFIG[router.pathname] || PAGE_CONFIG["/"];
    }, [router.pathname]);

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    if (device === "mobile") {
      return (
        <>
          <Head>
            <title>UCAR NEXT</title>
            <meta name="title" content="UCAR NEXT" />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id="top">
              <Top />
            </Stack>
            <Stack id="main">
              <Component {...props} />
            </Stack>
            <Stack id="footer">
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    }

    return (
      <>
        <Head>
          <title>UCAR NEXT</title>
          <meta name="title" content="UCAR NEXT" />
        </Head>
        <Stack id="pc-wrap">
          <Stack
            className={`header-basic ${pageConfig.isAuth ? "auth" : ""}`}
            style={{
              backgroundImage: `url(${pageConfig.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <Stack className="InteractiveNavbar">
              <InteractiveNavbar />
            </Stack>
            <Stack className="container">
              <strong>{t(pageConfig.title)}</strong>
              <span>{t(pageConfig.desc)}</span>
            </Stack>
          </Stack>

          <Stack id="main">
            <Component {...props} />
          </Stack>

          <Stack id="footer">
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutBasic;
