import React, { useState } from "react";
import { NextPage } from "next";
import { Pagination, Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { CarCard } from "./CarCard";
import { useReactiveVar } from "@apollo/client";
import { Car } from "../../types/car/car";
import { AgentCarsInquiry } from "../../types/car/car.input";
import { T } from "../../types/common";
import { CarStatus } from "../../enums/car.enum";
import { userVar } from "../../../apollo/store";
import { useRouter } from "next/router";

const MyCars: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const [searchFilter, setSearchFilter] =
    useState<AgentCarsInquiry>(initialInput);
  const [agentProperties, setAgentProperties] = useState<Car[]>([]);
  const [total, setTotal] = useState<number>(0);
  const user = useReactiveVar(userVar);
  const router = useRouter();

  /** APOLLO REQUESTS **/

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const changeStatusHandler = (value: CarStatus) => {
    setSearchFilter({ ...searchFilter, search: { carStatus: value } });
  };

  const deleteCarHandler = async (id: string) => {};

  const updateCarHandler = async (status: CarStatus, id: string) => {};

  if (user?.memberType !== "AGENT") {
    router.back();
  }

  if (device === "mobile") {
    return <div>NESTAR PROPERTIES MOBILE</div>;
  } else {
    return (
      <div id="my-property-page">
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">My Cars</Typography>
            <Typography className="sub-title">
              We are glad to see you again!
            </Typography>
          </Stack>
        </Stack>
        <Stack className="property-list-box">
          <Stack className="tab-name-box">
            <Typography
              onClick={() => changeStatusHandler(CarStatus.ACTIVE)}
              className={
                searchFilter.search.carStatus === "ACTIVE"
                  ? "active-tab-name"
                  : "tab-name"
              }
            >
              On Sale
            </Typography>
            <Typography
              onClick={() => changeStatusHandler(CarStatus.SOLD)}
              className={
                searchFilter.search.carStatus === "SOLD"
                  ? "active-tab-name"
                  : "tab-name"
              }
            >
              On Sold
            </Typography>
          </Stack>
          <Stack className="list-box">
            <Stack className="listing-title-box">
              <Typography className="title-text">Listing title</Typography>
              <Typography className="title-text">Date Published</Typography>
              <Typography className="title-text">Status</Typography>
              <Typography className="title-text">View</Typography>
              <Typography className="title-text">Action</Typography>
            </Stack>

            {agentProperties?.length === 0 ? (
              <div className={"no-data"}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No Car found!</p>
              </div>
            ) : (
              agentProperties.map((car: Car) => (
                <CarCard
                  key={car._id}
                  car={car}
                  deleteCarHandler={deleteCarHandler}
                  updateCarHandler={updateCarHandler}
                />
              ))
            )}

            {agentProperties.length !== 0 && (
              <Stack className="pagination-config">
                <Stack className="pagination-box">
                  <Pagination
                    count={Math.ceil(total / searchFilter.limit)}
                    page={searchFilter.page}
                    shape="circular"
                    color="primary"
                    onChange={paginationHandler}
                  />
                </Stack>
                <Stack className="total-result">
                  <Typography>{total} car available</Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </div>
    );
  }
};

MyCars.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    sort: "createdAt",
    search: {
      carStatus: "ACTIVE",
    },
  },
};

export default MyCars;
