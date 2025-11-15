import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Stack } from "@mui/material";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import Notice from "../../libs/components/cs/Notice";
import Faq from "../../libs/components/cs/Faq";
import Inquiry from "../../libs/components/cs/Inquiry";
import UserInquiryList from "../../libs/components/cs/UserInquiryList";
import { CsCategory } from "../../libs/enums/cs.enum";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import withI18n from "../../libs/i18n/withI18n";
import Head from "next/head";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const CS: NextPage = () => {
  const device = useDeviceDetect();
  const router = useRouter();

  /** HANDLERS **/
  const changeTabHandler = (tab: string) => {
    router.push(
      {
        pathname: "/cs",
        query: { tab: tab },
      },
      undefined,
      { scroll: false }
    );
  };
  const tab = router.query.tab ?? "notice";

  if (device === "mobile") {
    return (
      <>
        <Head>
          <title>Customer Service - UCAR</title>
          <meta
            name="description"
            content="Get help, find answers, and contact UCAR customer service. Your trusted car marketplace support in Korea."
          />
          <meta
            name="keywords"
            content="ucar support, customer service, help, faq, contact"
          />
        </Head>
        <h1>CS PAGE MOBILE</h1>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Customer Service - UCAR</title>
          <meta
            name="description"
            content="Get help, find answers, and contact UCAR customer service. Your trusted car marketplace support in Korea."
          />
          <meta
            name="keywords"
            content="ucar support, customer service, help, faq, contact"
          />
        </Head>
        <Stack className={"cs-page"}>
          <Stack className={"container"}>
            <Box component={"div"} className={"cs-main-info"}>
              <Box component={"div"} className={"info"}>
                <span>Help desk</span>
                <p>
                  Your direct line to assistance for any vehicle or purchase
                  inquiries.
                </p>
              </Box>
              <Box component={"div"} className={"btns"}>
                <div
                  className={tab == "notice" ? "active" : ""}
                  onClick={() => {
                    changeTabHandler("notice");
                  }}
                >
                  Notice
                </div>
                <div
                  className={tab == "faq" ? "active" : ""}
                  onClick={() => {
                    changeTabHandler("faq");
                  }}
                >
                  FAQ
                </div>
                <div
                  className={tab == "inquiry" ? "active" : ""}
                  onClick={() => {
                    changeTabHandler("inquiry");
                  }}
                >
                  Submit Inquiry
                </div>
                <div
                  className={tab == "myinquiries" ? "active" : ""}
                  onClick={() => {
                    changeTabHandler("myinquiries");
                  }}
                >
                  My Inquiries
                </div>
              </Box>
            </Box>

            <Box component={"div"} className={"cs-content"}>
              {tab === "notice" && <Notice />}

              {tab === "faq" && <Faq />}

              {tab === "inquiry" && <Inquiry />}

              {tab === "myinquiries" && <UserInquiryList />}
            </Box>
          </Stack>
        </Stack>
      </>
    );
  }
};

export default withI18n()(withLayoutBasic(CS));
