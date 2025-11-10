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
  "/agent": {
    title: "Agents",
    desc: "Home / For Lease",
    bgImage: "/img/banner/agents.webp",
  },
  "/agent/detail": {
    title: "Agent Page",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header2.svg",
  },
  "/mypage": {
    title: "my page",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header1.svg",
  },
  "/community": {
    title: "Community",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header2.svg",
  },
  "/community/detail": {
    title: "Community Detail",
    desc: "Home / For Lease",
    bgImage: "/img/banner/header2.svg",
  },
  "/cs": {
    title: "CS",
    desc: "We are glad to see you again!",
    bgImage: "/img/banner/header2.svg",
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
          <Stack className="InteractiveNavbar">
            <InteractiveNavbar />
          </Stack>

          <Stack
            className={`header-basic ${pageConfig.isAuth ? "auth" : ""}`}
            style={{
              backgroundImage: `url(${pageConfig.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
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
