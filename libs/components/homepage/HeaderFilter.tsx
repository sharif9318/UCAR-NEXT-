import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stack, Box, Modal, Divider, Button } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { carMileage, carYears } from "../../config";
import { CarLocation, CarType } from "../../enums/car.enum";
import { CarsInquiry } from "../../types/car/car.input";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  borderRadius: "12px",
  outline: "none",
  boxShadow: 24,
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "200px",
    },
  },
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
  initialInput: CarsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const { t, i18n } = useTranslation("common");
  const [searchFilter, setSearchFilter] = useState<CarsInquiry>(initialInput);
  const locationRef: any = useRef();
  const typeRef: any = useRef();
  const seatsRef: any = useRef();
  const router = useRouter();
  const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);
  const [carLocation, setCarLocation] = useState<CarLocation[]>(
    Object.values(CarLocation)
  );
  const [carType, setCarType] = useState<CarType[]>(Object.values(CarType));
  const [yearCheck, setYearCheck] = useState({ start: 1970, end: thisYear });
  const [optionCheck, setOptionCheck] = useState("all");

  /** LIFECYCLES **/
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!locationRef?.curlease?.contains(event.target)) {
        setOpenLocation(false);
      }

      if (!typeRef?.curlease?.contains(event.target)) {
        setOpenType(false);
      }

      if (!seatsRef?.curlease?.contains(event.target)) {
        setOpenRooms(false);
      }
    };

    document.addEventListener("mousedown", clickHandler);

    return () => {
      document.removeEventListener("mousedown", clickHandler);
    };
  }, []);

  /** HANDLERS **/
  const advancedFilterHandler = (status: boolean) => {
    setOpenLocation(false);
    setOpenRooms(false);
    setOpenType(false);
    setOpenAdvancedFilter(status);
  };

  const locationStateChangeHandler = () => {
    setOpenLocation((prev) => !prev);
    setOpenRooms(false);
    setOpenType(false);
  };

  const typeStateChangeHandler = () => {
    setOpenType((prev) => !prev);
    setOpenLocation(false);
    setOpenRooms(false);
  };

  const seatStateChangeHandler = () => {
    setOpenRooms((prev) => !prev);
    setOpenType(false);
    setOpenLocation(false);
  };

  const disableAllStateHandler = () => {
    setOpenRooms(false);
    setOpenType(false);
    setOpenLocation(false);
  };

  const carLocationSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            locationList: [value],
          },
        });
        typeStateChangeHandler();
      } catch (err: any) {
        console.log("ERROR, carLocationSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carTypeSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            typeList: [value],
          },
        });
        seatStateChangeHandler();
      } catch (err: any) {
        console.log("ERROR, carTypeSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carSeatsSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            seatsList: [value],
          },
        });
        disableAllStateHandler();
      } catch (err: any) {
        console.log("ERROR, carSeatsSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carYearSelectHandler = useCallback(
    async (number: Number) => {
      try {
        if (number != 0) {
          if (searchFilter?.search?.yearsList?.includes(number)) {
            setSearchFilter({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                yearsList: searchFilter?.search?.yearsList?.filter(
                  (item: Number) => item !== number
                ),
              },
            });
          } else {
            setSearchFilter({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                yearsList: [...(searchFilter?.search?.yearsList || []), number],
              },
            });
          }
        } else {
          delete searchFilter?.search.yearsList;
          setSearchFilter({ ...searchFilter });
        }

        console.log("carYearSelectHandler:", number);
      } catch (err: any) {
        console.log("ERROR, carYearSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carOptionSelectHandler = useCallback(
    async (e: any) => {
      try {
        const value = e.target.value;
        setOptionCheck(value);

        if (value !== "all") {
          setSearchFilter({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              options: [value],
            },
          });
        } else {
          delete searchFilter.search.options;
          setSearchFilter({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          });
        }
      } catch (err: any) {
        console.log("ERROR, carOptionSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carMileageHandler = useCallback(
    async (e: any, type: string) => {
      const value = e.target.value;

      if (type == "start") {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            // @ts-ignore
            mileageRange: {
              ...searchFilter.search.mileageRange,
              start: parseInt(value),
            },
          },
        });
      } else {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            // @ts-ignore
            mileageRange: {
              ...searchFilter.search.mileageRange,
              end: parseInt(value),
            },
          },
        });
      }
    },
    [searchFilter]
  );

  const yearStartChangeHandler = async (event: any) => {
    setYearCheck({ ...yearCheck, start: Number(event.target.value) });

    setSearchFilter({
      ...searchFilter,
      search: {
        ...searchFilter.search,
        periodsRange: { start: Number(event.target.value), end: yearCheck.end },
      },
    });
  };

  const yearEndChangeHandler = async (event: any) => {
    setYearCheck({ ...yearCheck, end: Number(event.target.value) });

    setSearchFilter({
      ...searchFilter,
      search: {
        ...searchFilter.search,
        periodsRange: {
          start: yearCheck.start,
          end: Number(event.target.value),
        },
      },
    });
  };

  const resetFilterHandler = () => {
    setSearchFilter(initialInput);
    setOptionCheck("all");
    setYearCheck({ start: 1970, end: thisYear });
  };

  const pushSearchHandler = async () => {
    try {
      if (searchFilter?.search?.locationList?.length == 0) {
        delete searchFilter.search.locationList;
      }

      if (searchFilter?.search?.typeList?.length == 0) {
        delete searchFilter.search.typeList;
      }

      if (searchFilter?.search?.seatsList?.length == 0) {
        delete searchFilter.search.seatsList;
      }

      if (searchFilter?.search?.options?.length == 0) {
        delete searchFilter.search.options;
      }

      if (searchFilter?.search?.yearsList?.length == 0) {
        delete searchFilter.search.yearsList;
      }

      await router.push(
        `/car?input=${JSON.stringify(searchFilter)}`,
        `/car?input=${JSON.stringify(searchFilter)}`
      );
    } catch (err: any) {
      console.log("ERROR, pushSearchHandler:", err);
    }
  };

  if (device === "mobile") {
    return <div>HEADER FILTER MOBILE</div>;
  } else {
    return (
      <>
        <Stack className={"search-box"}>
          <Stack className={"select-box"}>
            <Box
              component={"div"}
              className={`box ${openLocation ? "on" : ""}`}
              onClick={locationStateChangeHandler}
            >
              <span>
                {searchFilter?.search?.locationList
                  ? searchFilter?.search?.locationList[0]
                  : t("Location")}{" "}
              </span>
              <ExpandMoreIcon />
            </Box>
            <Box
              className={`box ${openType ? "on" : ""}`}
              onClick={typeStateChangeHandler}
            >
              <span>
                {" "}
                {searchFilter?.search?.typeList
                  ? searchFilter?.search?.typeList[0]
                  : t("Car type")}{" "}
              </span>
              <ExpandMoreIcon />
            </Box>
            <Box
              className={`box ${openRooms ? "on" : ""}`}
              onClick={seatStateChangeHandler}
            >
              <span>
                {searchFilter?.search?.seatsList
                  ? `${searchFilter?.search?.seatsList[0]} seats}`
                  : t("Rooms")}
              </span>
              <ExpandMoreIcon />
            </Box>
          </Stack>
          <Stack className={"search-box-other"}>
            <Box
              className={"advanced-filter"}
              onClick={() => advancedFilterHandler(true)}
            >
              <img src="/img/icons/tune.svg" alt="" />
              <span>{t("Advanced")}</span>
            </Box>
            <Box className={"search-btn"} onClick={pushSearchHandler}>
              <img src="/img/icons/search_white.svg" alt="" />
            </Box>
          </Stack>

          {/*MENU */}
          <div
            className={`filter-location ${openLocation ? "on" : ""}`}
            ref={locationRef}
          >
            {carLocation.map((location: string) => {
              return (
                <div
                  onClick={() => carLocationSelectHandler(location)}
                  key={location}
                >
                  <img src={`img/banner/cities/${location}.webp`} alt="" />
                  <span>{location}</span>
                </div>
              );
            })}
          </div>

          <div className={`filter-type ${openType ? "on" : ""}`} ref={typeRef}>
            {carType.map((type: string) => {
              return (
                <div
                  style={{
                    backgroundImage: `url(/img/banner/types/${type.toLowerCase()}.webp)`,
                  }}
                  onClick={() => carTypeSelectHandler(type)}
                  key={type}
                >
                  <span>{type}</span>
                </div>
              );
            })}
          </div>

          <div
            className={`filter-seats ${openRooms ? "on" : ""}`}
            ref={seatsRef}
          >
            {[1, 2, 3, 4, 5].map((seat: number) => {
              return (
                <span onClick={() => carSeatsSelectHandler(seat)} key={seat}>
                  {seat} seat{seat > 1 ? "s" : ""}
                </span>
              );
            })}
          </div>
        </Stack>

        {/* ADVANCED FILTER MODAL */}
        <Modal
          open={openAdvancedFilter}
          onClose={() => advancedFilterHandler(false)}
          aria-labelledby="modal-modal-title"
          aria-descriyearby="modal-modal-description"
        >
          {/* @ts-ignore */}
          <Box sx={style}>
            <Box className={"advanced-filter-modal"}>
              <div
                className={"close"}
                onClick={() => advancedFilterHandler(false)}
              >
                <CloseIcon />
              </div>
              <div className={"top"}>
                <span>Find your home</span>
                <div className={"search-input-box"}>
                  <img src="/img/icons/search.svg" alt="" />
                  <input
                    value={searchFilter?.search?.text ?? ""}
                    type="text"
                    placeholder={"What are you looking for?"}
                    onChange={(e: any) => {
                      setSearchFilter({
                        ...searchFilter,
                        search: {
                          ...searchFilter.search,
                          text: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <Divider sx={{ mt: "30px", mb: "35px" }} />
              <div className={"middle"}>
                <div className={"row-box"}>
                  <div className={"box"}>
                    <span>Seats</span>
                    <div className={"inside"}>
                      <div
                        className={`seat ${
                          !searchFilter?.search?.yearsList ? "active" : ""
                        }`}
                        onClick={() => carYearSelectHandler(0)}
                      >
                        Any
                      </div>
                      {[1, 2, 3, 4, 5].map((year: number) => (
                        <div
                          className={`seat ${
                            searchFilter?.search?.yearsList?.includes(year)
                              ? "active"
                              : ""
                          }`}
                          onClick={() => carYearSelectHandler(year)}
                          key={year}
                        >
                          {year == 0 ? "Any" : year}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={"box"}>
                    <span>options</span>
                    <div className={"inside"}>
                      <FormControl>
                        <Select
                          value={optionCheck}
                          onChange={carOptionSelectHandler}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value={"all"}>All Options</MenuItem>
                          <MenuItem value={"carTradeIn"}>Trade-In</MenuItem>
                          <MenuItem value={"carLease"}>Lease</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className={"row-box"} style={{ marginTop: "44px" }}>
                  <div className={"box"}>
                    <span>Model Year</span>
                    <div className={"inside space-between align-center"}>
                      <FormControl sx={{ width: "122px" }}>
                        <Select
                          value={yearCheck.start.toString()}
                          onChange={yearStartChangeHandler}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                        >
                          {carYears?.slice(0)?.map((year: number) => (
                            <MenuItem
                              value={year}
                              disabled={yearCheck.end <= year}
                              key={year}
                            >
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div className={"minus-line"}></div>
                      <FormControl sx={{ width: "122px" }}>
                        <Select
                          value={yearCheck.end.toString()}
                          onChange={yearEndChangeHandler}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                        >
                          {carYears
                            ?.slice(0)
                            .reverse()
                            .map((year: number) => (
                              <MenuItem
                                value={year}
                                disabled={yearCheck.start >= year}
                                key={year}
                              >
                                {year}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className={"box"}>
                    <span>Mileage</span>
                    <div className={"inside space-between align-center"}>
                      <FormControl sx={{ width: "122px" }}>
                        <Select
                          value={searchFilter?.search?.mileageRange?.start}
                          onChange={(e: any) => carMileageHandler(e, "start")}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                        >
                          {carMileage.map((square: number) => (
                            <MenuItem
                              value={square}
                              disabled={
                                (searchFilter?.search?.mileageRange?.end || 0) <
                                square
                              }
                              key={square}
                            >
                              {square}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div className={"minus-line"}></div>
                      <FormControl sx={{ width: "122px" }}>
                        <Select
                          value={searchFilter?.search?.mileageRange?.end}
                          onChange={(e: any) => carMileageHandler(e, "end")}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                        >
                          {carMileage.map((square: number) => (
                            <MenuItem
                              value={square}
                              disabled={
                                (searchFilter?.search?.mileageRange?.start ||
                                  0) > square
                              }
                              key={square}
                            >
                              {square}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <Divider sx={{ mt: "60px", mb: "18px" }} />
              <div className={"bottom"}>
                <div onClick={resetFilterHandler}>
                  <img src="/img/icons/reset.svg" alt="" />
                  <span>Reset all filters</span>
                </div>
                <Button
                  startIcon={<img src={"/img/icons/search.svg"} />}
                  className={"search-btn"}
                  onClick={pushSearchHandler}
                >
                  Search
                </Button>
              </div>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
};

HeaderFilter.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    search: {
      mileageRange: {
        start: 0,
        end: 500,
      },
      pricesRange: {
        start: 0,
        end: 2000000,
      },
    },
  },
};

export default HeaderFilter;
