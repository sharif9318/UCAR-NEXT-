import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Checkbox,
  Button,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Chip,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { CarLocation, CarType } from "../../enums/car.enum";
import { CarsInquiry } from "../../types/car/car.input";
import { useRouter } from "next/router";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { carMileage } from "../../config";
import RefreshIcon from "@mui/icons-material/Refresh";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "200px",
    },
  },
};

interface FilterType {
  searchFilter: CarsInquiry;
  setSearchFilter: any;
  initialInput: CarsInquiry;
}

const Filter = (props: FilterType) => {
  const { searchFilter, setSearchFilter, initialInput } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const [carLocation, setCarLocation] = useState<CarLocation[]>(
    Object.values(CarLocation)
  );
  const [carType, setCarType] = useState<CarType[]>(Object.values(CarType));
  const [searchText, setSearchText] = useState<string>("");
  const [openLocation, setOpenLocation] = useState<boolean>(false);

  /** LIFECYCLES **/
  useEffect(() => {
    if (searchFilter?.search?.locationList?.length == 0) {
      delete searchFilter.search.locationList;
      setOpenLocation(false);
      router
        .push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          { scroll: false }
        )
        .then();
    }

    if (searchFilter?.search?.typeList?.length == 0) {
      delete searchFilter.search.typeList;
      router
        .push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          { scroll: false }
        )
        .then();
    }

    if (searchFilter?.search?.seatsList?.length == 0) {
      delete searchFilter.search.seatsList;
      router
        .push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          { scroll: false }
        )
        .then();
    }

    if (searchFilter?.search?.options?.length == 0) {
      delete searchFilter.search.options;
      router
        .push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          { scroll: false }
        )
        .then();
    }

    if (searchFilter?.search?.yearsList?.length == 0) {
      delete searchFilter.search.yearsList;
      router
        .push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
            },
          })}`,
          { scroll: false }
        )
        .then();
    }

    if (searchFilter?.search?.locationList) setOpenLocation(true);
  }, [searchFilter]);

  // Active filters helpers
  const removeLocation = useCallback(
    async (value: string) => {
      if (!searchFilter?.search?.locationList) return;
      const next = searchFilter.search.locationList.filter(
        (v: string) => v !== value
      );
      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            locationList: next.length ? next : undefined,
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            locationList: next.length ? next : undefined,
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter]
  );

  const removeType = useCallback(
    async (value: string) => {
      if (!searchFilter?.search?.typeList) return;
      const next = searchFilter.search.typeList.filter(
        (v: string) => v !== value
      );
      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            typeList: next.length ? next : undefined,
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            typeList: next.length ? next : undefined,
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter]
  );

  const removeSeats = useCallback(
    async (num: Number) => {
      if (!searchFilter?.search?.seatsList) return;
      if (searchFilter.search.seatsList.includes(num)) {
        const next = searchFilter.search.seatsList.filter(
          (n: Number) => n !== num
        );
        await router.push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              seatsList: next.length ? next : undefined,
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              seatsList: next.length ? next : undefined,
            },
          })}`,
          { scroll: false }
        );
      }
    },
    [searchFilter]
  );

  const removeYear = useCallback(
    async (num: Number) => {
      if (!searchFilter?.search?.yearsList) return;
      const next = searchFilter.search.yearsList.filter(
        (n: Number) => n !== num
      );
      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            yearsList: next.length ? next : undefined,
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            yearsList: next.length ? next : undefined,
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter]
  );

  const removeOption = useCallback(
    async (value: string) => {
      if (!searchFilter?.search?.options) return;
      const next = searchFilter.search.options.filter(
        (v: string) => v !== value
      );
      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            options: next.length ? next : undefined,
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            options: next.length ? next : undefined,
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter]
  );

  const resetMileage = useCallback(async () => {
    await router.push(
      `/car?input=${JSON.stringify({
        ...searchFilter,
        search: { ...searchFilter.search, mileageRange: {} },
      })}`,
      `/car?input=${JSON.stringify({
        ...searchFilter,
        search: { ...searchFilter.search, mileageRange: {} },
      })}`,
      { scroll: false }
    );
  }, [searchFilter]);

  const resetPrice = useCallback(async () => {
    const { pricesRange, ...rest } = searchFilter.search || ({} as any);
    await router.push(
      `/car?input=${JSON.stringify({
        ...searchFilter,
        search: { ...rest },
      })}`,
      `/car?input=${JSON.stringify({
        ...searchFilter,
        search: { ...rest },
      })}`,
      { scroll: false }
    );
  }, [searchFilter]);

  /** HANDLERS **/
  const carLocationSelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;
        if (isChecked) {
          await router.push(
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                locationList: [
                  ...(searchFilter?.search?.locationList || []),
                  value,
                ],
              },
            })}`,
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                locationList: [
                  ...(searchFilter?.search?.locationList || []),
                  value,
                ],
              },
            })}`,
            { scroll: false }
          );
        } else if (searchFilter?.search?.locationList?.includes(value)) {
          await router.push(
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                locationList: searchFilter?.search?.locationList?.filter(
                  (item: string) => item !== value
                ),
              },
            })}`,
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                locationList: searchFilter?.search?.locationList?.filter(
                  (item: string) => item !== value
                ),
              },
            })}`,
            { scroll: false }
          );
        }
      } catch (err: any) {
        console.error("ERROR, carLocationSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carTypeSelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;
        if (isChecked) {
          await router.push(
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                typeList: [...(searchFilter?.search?.typeList || []), value],
              },
            })}`,
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                typeList: [...(searchFilter?.search?.typeList || []), value],
              },
            })}`,
            { scroll: false }
          );
        } else if (searchFilter?.search?.typeList?.includes(value)) {
          await router.push(
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                typeList: searchFilter?.search?.typeList?.filter(
                  (item: string) => item !== value
                ),
              },
            })}`,
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                typeList: searchFilter?.search?.typeList?.filter(
                  (item: string) => item !== value
                ),
              },
            })}`,
            { scroll: false }
          );
        }
      } catch (err: any) {
        console.error("ERROR, carTypeSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carSeatsSelectHandler = useCallback(
    async (number: Number) => {
      try {
        if (number != 0) {
          if (searchFilter?.search?.seatsList?.includes(number)) {
            await router.push(
              `/car?input=${JSON.stringify({
                ...searchFilter,
                search: {
                  ...searchFilter.search,
                  seatsList: searchFilter?.search?.seatsList?.filter(
                    (item: Number) => item !== number
                  ),
                },
              })}`,
              `/car?input=${JSON.stringify({
                ...searchFilter,
                search: {
                  ...searchFilter.search,
                  seatsList: searchFilter?.search?.seatsList?.filter(
                    (item: Number) => item !== number
                  ),
                },
              })}`,
              { scroll: false }
            );
          } else {
            await router.push(
              `/car?input=${JSON.stringify({
                ...searchFilter,
                search: {
                  ...searchFilter.search,
                  seatsList: [
                    ...(searchFilter?.search?.seatsList || []),
                    number,
                  ],
                },
              })}`,
              `/car?input=${JSON.stringify({
                ...searchFilter,
                search: {
                  ...searchFilter.search,
                  seatsList: [
                    ...(searchFilter?.search?.seatsList || []),
                    number,
                  ],
                },
              })}`,
              { scroll: false }
            );
          }
        } else {
          delete searchFilter?.search.seatsList;
          setSearchFilter({ ...searchFilter });
          await router.push(
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
              },
            })}`,
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
              },
            })}`,
            { scroll: false }
          );
        }
      } catch (err: any) {
        console.error("ERROR, carSeatsSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carOptionSelectHandler = useCallback(
    async (e: any) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;
        if (isChecked) {
          await router.push(
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                options: [...(searchFilter?.search?.options || []), value],
              },
            })}`,
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                options: [...(searchFilter?.search?.options || []), value],
              },
            })}`,
            { scroll: false }
          );
        } else if (searchFilter?.search?.options?.includes(value)) {
          await router.push(
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                options: searchFilter?.search?.options?.filter(
                  (item: string) => item !== value
                ),
              },
            })}`,
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                options: searchFilter?.search?.options?.filter(
                  (item: string) => item !== value
                ),
              },
            })}`,
            { scroll: false }
          );
        }
      } catch (err: any) {
        console.error("ERROR, carOptionSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carYearSelectHandler = useCallback(
    async (number: Number) => {
      try {
        if (number != 0) {
          if (searchFilter?.search?.yearsList?.includes(number)) {
            await router.push(
              `/car?input=${JSON.stringify({
                ...searchFilter,
                search: {
                  ...searchFilter.search,
                  yearsList: searchFilter?.search?.yearsList?.filter(
                    (item: Number) => item !== number
                  ),
                },
              })}`,
              `/car?input=${JSON.stringify({
                ...searchFilter,
                search: {
                  ...searchFilter.search,
                  yearsList: searchFilter?.search?.yearsList?.filter(
                    (item: Number) => item !== number
                  ),
                },
              })}`,
              { scroll: false }
            );
          } else {
            await router.push(
              `/car?input=${JSON.stringify({
                ...searchFilter,
                search: {
                  ...searchFilter.search,
                  yearsList: [
                    ...(searchFilter?.search?.yearsList || []),
                    number,
                  ],
                },
              })}`,
              `/car?input=${JSON.stringify({
                ...searchFilter,
                search: {
                  ...searchFilter.search,
                  yearsList: [
                    ...(searchFilter?.search?.yearsList || []),
                    number,
                  ],
                },
              })}`,
              { scroll: false }
            );
          }
        } else {
          delete searchFilter?.search.yearsList;
          setSearchFilter({ ...searchFilter });
          await router.push(
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
              },
            })}`,
            `/car?input=${JSON.stringify({
              ...searchFilter,
              search: {
                ...searchFilter.search,
              },
            })}`,
            { scroll: false }
          );
        }
      } catch (err: any) {
        console.error("ERROR, carYearSelectHandler:", err);
      }
    },
    [searchFilter]
  );

  const carMileageHandler = useCallback(
    async (e: any, type: string) => {
      const value = e.target.value;

      if (type == "start") {
        await router.push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              mileageRange: {
                ...searchFilter.search.mileageRange,
                start: value,
              },
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              mileageRange: {
                ...searchFilter.search.mileageRange,
                start: value,
              },
            },
          })}`,
          { scroll: false }
        );
      } else {
        await router.push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              mileageRange: { ...searchFilter.search.mileageRange, end: value },
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              mileageRange: { ...searchFilter.search.mileageRange, end: value },
            },
          })}`,
          { scroll: false }
        );
      }
    },
    [searchFilter]
  );

  const carPriceHandler = useCallback(
    async (value: number, type: string) => {
      if (type == "start") {
        await router.push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              pricesRange: {
                ...searchFilter.search.pricesRange,
                start: value * 1,
              },
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              pricesRange: {
                ...searchFilter.search.pricesRange,
                start: value * 1,
              },
            },
          })}`,
          { scroll: false }
        );
      } else {
        await router.push(
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              pricesRange: {
                ...searchFilter.search.pricesRange,
                end: value * 1,
              },
            },
          })}`,
          `/car?input=${JSON.stringify({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              pricesRange: {
                ...searchFilter.search.pricesRange,
                end: value * 1,
              },
            },
          })}`,
          { scroll: false }
        );
      }
    },
    [searchFilter]
  );

  const refreshHandler = useCallback(async () => {
    try {
      setSearchText("");
      await router.push(
        `/car?input=${JSON.stringify(initialInput)}`,
        `/car?input=${JSON.stringify(initialInput)}`,
        { scroll: false }
      );
    } catch (err: any) {
      console.error("ERROR, refreshHandler:", err);
    }
  }, [router, initialInput]);

  if (device === "mobile") {
    return <div>CARS FILTER</div>;
  } else {
    const chips: React.ReactNode[] = [];
    (searchFilter?.search?.locationList || []).forEach((loc: string) =>
      chips.push(
        <Chip
          key={`loc-${loc}`}
          label={loc}
          onDelete={() => removeLocation(loc)}
          size="small"
          color="error"
          variant="outlined"
        />
      )
    );
    (searchFilter?.search?.typeList || []).forEach((t: string) =>
      chips.push(
        <Chip
          key={`type-${t}`}
          label={t}
          onDelete={() => removeType(t)}
          size="small"
          color="error"
          variant="outlined"
        />
      )
    );
    (searchFilter?.search?.seatsList || []).forEach((n: Number) =>
      chips.push(
        <Chip
          key={`seats-${n}`}
          label={`${n} seats`}
          onDelete={() => removeSeats(n)}
          size="small"
          color="error"
          variant="outlined"
        />
      )
    );
    (searchFilter?.search?.yearsList || []).forEach((n: Number) =>
      chips.push(
        <Chip
          key={`years-${n}`}
          label={`${n} yrs`}
          onDelete={() => removeYear(n)}
          size="small"
          color="error"
          variant="outlined"
        />
      )
    );
    const hasMileage =
      searchFilter?.search?.mileageRange?.start != null ||
      searchFilter?.search?.mileageRange?.end != null;
    if (hasMileage) {
      chips.push(
        <Chip
          key={`mileage`}
          label={`km ${searchFilter?.search?.mileageRange?.start ?? 0} - ${
            searchFilter?.search?.mileageRange?.end ?? 500
          }`}
          onDelete={resetMileage}
          size="small"
          color="error"
          variant="outlined"
        />
      );
    }
    const hasPrice =
      searchFilter?.search?.pricesRange?.start != null ||
      searchFilter?.search?.pricesRange?.end != null;
    if (hasPrice) {
      chips.push(
        <Chip
          key={`price`}
          label={`$ ${searchFilter?.search?.pricesRange?.start ?? 0} - ${
            searchFilter?.search?.pricesRange?.end ?? 0
          }`}
          onDelete={resetPrice}
          size="small"
          color="error"
          variant="outlined"
        />
      );
    }

    return (
      <Stack className={"filter-main"}>
        <Stack className={"find-your-home"} mb={"40px"}>
          <Typography className={"title-main"}>Find Your Car</Typography>
          <Stack className={"input-box"}>
            <OutlinedInput
              value={searchText}
              type={"text"}
              className={"search-input"}
              placeholder={"What are you looking for?"}
              onChange={(e: any) => setSearchText(e.target.value)}
              onKeyDown={(event: any) => {
                if (event.key == "Enter") {
                  setSearchFilter({
                    ...searchFilter,
                    search: { ...searchFilter.search, text: searchText },
                  });
                }
              }}
              endAdornment={
                <>
                  <CancelRoundedIcon
                    onClick={() => {
                      setSearchText("");
                      setSearchFilter({
                        ...searchFilter,
                        search: { ...searchFilter.search, text: "" },
                      });
                    }}
                  />
                </>
              }
            />
            <img src={"/img/icons/search_icon.png"} alt={""} />
            <Tooltip title="Reset">
              <IconButton onClick={refreshHandler}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          {chips.length > 0 && (
            <Stack
              direction="row"
              gap={1}
              mt={2}
              flexWrap="wrap"
              alignItems="center"
            >
              {chips}
              <Tooltip title="Clear all">
                <IconButton onClick={refreshHandler} size="small">
                  <ClearAllIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>
        <Stack className={"find-your-home"} mb={"30px"}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <p
              className={"title"}
              style={{ textShadow: "0px 3px 4px #b9b9b9" }}
            >
              Location
            </p>
            <Stack direction="row" alignItems="center" gap={1}>
              {(searchFilter?.search?.locationList || []).length > 0 && (
                <Button
                  size="small"
                  onClick={() =>
                    router.push(
                      `/car?input=${JSON.stringify({
                        ...searchFilter,
                        search: {
                          ...searchFilter.search,
                          locationList: undefined,
                        },
                      })}`,
                      `/car?input=${JSON.stringify({
                        ...searchFilter,
                        search: {
                          ...searchFilter.search,
                          locationList: undefined,
                        },
                      })}`,
                      { scroll: false }
                    )
                  }
                >
                  Clear
                </Button>
              )}
              <IconButton
                size="small"
                onClick={() => setOpenLocation(!openLocation)}
              >
                {openLocation ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          </Stack>
          <Collapse in={openLocation}>
            <Stack className={`car-location`}>
              {carLocation.map((location: string) => {
                return (
                  <Stack className={"input-box"} key={location}>
                    <Checkbox
                      id={location}
                      className="car-checkbox"
                      color="default"
                      size="small"
                      value={location}
                      checked={(
                        searchFilter?.search?.locationList || []
                      ).includes(location as CarLocation)}
                      onChange={carLocationSelectHandler}
                    />
                    <label htmlFor={location} style={{ cursor: "pointer" }}>
                      <Typography className="car-type">{location}</Typography>
                    </label>
                  </Stack>
                );
              })}
            </Stack>
          </Collapse>
        </Stack>
        <Stack className={"find-your-home"} mb={"30px"}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={"title"}>Car Type</Typography>
            {(searchFilter?.search?.typeList || []).length > 0 && (
              <Button
                size="small"
                onClick={() =>
                  router.push(
                    `/car?input=${JSON.stringify({
                      ...searchFilter,
                      search: { ...searchFilter.search, typeList: undefined },
                    })}`,
                    `/car?input=${JSON.stringify({
                      ...searchFilter,
                      search: { ...searchFilter.search, typeList: undefined },
                    })}`,
                    { scroll: false }
                  )
                }
              >
                Clear
              </Button>
            )}
          </Stack>
          {carType.map((type: string) => (
            <Stack className={"input-box"} key={type}>
              <Checkbox
                id={type}
                className="car-checkbox"
                color="default"
                size="small"
                value={type}
                onChange={carTypeSelectHandler}
                checked={(searchFilter?.search?.typeList || []).includes(
                  type as CarType
                )}
              />
              <label style={{ cursor: "pointer" }}>
                <Typography className="car_type">{type}</Typography>
              </label>
            </Stack>
          ))}
        </Stack>
        <Stack className={"find-your-home"} mb={"30px"}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={"title"}>Seats</Typography>
            {(searchFilter?.search?.seatsList || []).length > 0 && (
              <Button size="small" onClick={() => carSeatsSelectHandler(0)}>
                Clear
              </Button>
            )}
          </Stack>
          <Stack className="button-group">
            <Button
              sx={{
                borderRadius: "12px 0 0 12px",
                border: !searchFilter?.search?.seatsList
                  ? "2px solid #E50914"
                  : "1px solid #b9b9b9",
              }}
              onClick={() => carSeatsSelectHandler(0)}
            >
              Any
            </Button>
            {[1, 2, 3, 4, 5].map((n, idx) => (
              <Button
                key={n}
                sx={{
                  borderRadius: idx === 4 ? "0 12px 12px 0" : 0,
                  border: searchFilter?.search?.seatsList?.includes(n)
                    ? "2px solid #E50914"
                    : "1px solid #b9b9b9",
                  borderLeft: searchFilter?.search?.seatsList?.includes(n)
                    ? undefined
                    : "none",
                }}
                onClick={() => carSeatsSelectHandler(n as unknown as Number)}
              >
                {n === 5 ? "5+" : n}
              </Button>
            ))}
          </Stack>
        </Stack>
        <Stack className={"find-your-home"} mb={"30px"}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={"title"}>Year Range</Typography>
            {(searchFilter?.search?.yearsList || []).length > 0 && (
              <Button size="small" onClick={() => carYearSelectHandler(0)}>
                Clear
              </Button>
            )}
          </Stack>
          <Stack className="button-group">
            <Button
              sx={{
                borderRadius: "12px 0 0 12px",
                border: !searchFilter?.search?.yearsList
                  ? "2px solid #E50914"
                  : "1px solid #b9b9b9",
              }}
              onClick={() => carYearSelectHandler(0)}
            >
              Any
            </Button>
            {[1, 2, 3, 4, 5].map((n, idx) => (
              <Button
                key={n}
                sx={{
                  borderRadius: idx === 4 ? "0 12px 12px 0" : 0,
                  border: searchFilter?.search?.yearsList?.includes(n)
                    ? "2px solid #E50914"
                    : "1px solid #b9b9b9",
                  borderLeft: searchFilter?.search?.yearsList?.includes(n)
                    ? undefined
                    : "none",
                }}
                onClick={() => carYearSelectHandler(n as unknown as Number)}
              >
                {n === 5 ? "5+" : n}
              </Button>
            ))}
          </Stack>
        </Stack>
        <Stack className={"find-your-home"} mb={"30px"}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={"title"}>Options</Typography>
            {(searchFilter?.search?.options || []).length > 0 && (
              <Button
                size="small"
                onClick={() =>
                  router.push(
                    `/car?input=${JSON.stringify({
                      ...searchFilter,
                      search: { ...searchFilter.search, options: undefined },
                    })}`,
                    `/car?input=${JSON.stringify({
                      ...searchFilter,
                      search: { ...searchFilter.search, options: undefined },
                    })}`,
                    { scroll: false }
                  )
                }
              >
                Clear
              </Button>
            )}
          </Stack>
          <Stack className={"input-box"}>
            <Checkbox
              id={"Trade-In"}
              className="car-checkbox"
              color="default"
              size="small"
              value={"carTradeIn"}
              checked={(searchFilter?.search?.options || []).includes(
                "carTradeIn"
              )}
              onChange={carOptionSelectHandler}
            />
            <label htmlFor={"Trade-In"} style={{ cursor: "pointer" }}>
              <Typography className="car-type">Trade-In</Typography>
            </label>
          </Stack>
          <Stack className={"input-box"}>
            <Checkbox
              id={"Lease"}
              className="car-checkbox"
              color="default"
              size="small"
              value={"carLease"}
              checked={(searchFilter?.search?.options || []).includes(
                "carLease"
              )}
              onChange={carOptionSelectHandler}
            />
            <label htmlFor={"Lease"} style={{ cursor: "pointer" }}>
              <Typography className="car-type">Lease</Typography>
            </label>
          </Stack>
        </Stack>
        <Stack className={"find-your-home"} mb={"30px"}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={"title"}>Mileage (km)</Typography>
            {hasMileage && (
              <Button size="small" onClick={resetMileage}>
                Reset
              </Button>
            )}
          </Stack>
          <Stack className="square-year-input">
            <FormControl>
              <InputLabel id="demo-simple-select-label">Min</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchFilter?.search?.mileageRange?.start ?? 0}
                label="Min"
                onChange={(e: any) => carMileageHandler(e, "start")}
                MenuProps={MenuProps}
              >
                {carMileage.map((square: number) => (
                  <MenuItem
                    value={square}
                    disabled={
                      (searchFilter?.search?.mileageRange?.end || 0) < square
                    }
                    key={square}
                  >
                    {square}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="central-divider"></div>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Max</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchFilter?.search?.mileageRange?.end ?? 500}
                label="Max"
                onChange={(e: any) => carMileageHandler(e, "end")}
                MenuProps={MenuProps}
              >
                {carMileage.map((square: number) => (
                  <MenuItem
                    value={square}
                    disabled={
                      (searchFilter?.search?.mileageRange?.start || 0) > square
                    }
                    key={square}
                  >
                    {square}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Stack className={"find-your-home"}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={"title"}>Price Range</Typography>
            {hasPrice && (
              <Button size="small" onClick={resetPrice}>
                Reset
              </Button>
            )}
          </Stack>
          <Stack className="square-year-input">
            <input
              type="number"
              placeholder="$ min"
              min={0}
              value={searchFilter?.search?.pricesRange?.start ?? 0}
              onChange={(e: any) => {
                if (e.target.value >= 0) {
                  carPriceHandler(e.target.value, "start");
                }
              }}
            />
            <div className="central-divider"></div>
            <input
              type="number"
              placeholder="$ max"
              value={searchFilter?.search?.pricesRange?.end ?? 0}
              onChange={(e: any) => {
                if (e.target.value >= 0) {
                  carPriceHandler(e.target.value, "end");
                }
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default Filter;
