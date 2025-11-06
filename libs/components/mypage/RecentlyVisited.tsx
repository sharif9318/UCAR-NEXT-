import React, { useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Pagination, Stack, Typography } from "@mui/material";
import CarCard from "../car/CarCard";
import { Car } from "../../types/car/car";
import { T } from "../../types/common";
import { useTranslation } from "react-i18next";

const RecentlyVisited: NextPage = () => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const [recentlyVisited, setRecentlyVisited] = useState<Car[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

  /** APOLLO REQUESTS **/

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchVisited({ ...searchVisited, page: value });
  };

  if (device === "mobile") {
    return <div>NESTAR MY FAVORITES MOBILE</div>;
  } else {
    return (
      <div id="my-favorites-page">
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">
              {t("mypage.recentlyVisited")}
            </Typography>
            <Typography className="sub-title">
              {t("We are glad to see you again!")}
            </Typography>
          </Stack>
        </Stack>
        <Stack className="favorites-list-box">
          {recentlyVisited?.length ? (
            recentlyVisited?.map((car: Car) => {
              return <CarCard car={car} recentlyVisited={true} />;
            })
          ) : (
            <div className={"no-data"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>{t("mypage.noRecentlyVisited")}</p>
            </div>
          )}
        </Stack>
        {recentlyVisited?.length ? (
          <Stack className="pagination-config">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(total / searchVisited.limit)}
                page={searchVisited.page}
                shape="circular"
                color="primary"
                onChange={paginationHandler}
              />
            </Stack>
            <Stack className="total-result">
              <Typography>
                {t("mypage.totalRecentlyVisited", { count: total })}
              </Typography>
            </Stack>
          </Stack>
        ) : null}
      </div>
    );
  }
};

export default RecentlyVisited;
