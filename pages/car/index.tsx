import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NextPage } from "next";
import {
  Box,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import CarCard from "../../libs/components/car/CarCard";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import Filter from "../../libs/components/car/Filter";
import { useRouter } from "next/router";
import { CarsInquiry } from "../../libs/types/car/car.input";
import { Car } from "../../libs/types/car/car";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Direction, Message } from "../../libs/enums/common.enum";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CARS } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { LIKE_TARGET_CAR } from "../../apollo/user/mutation";
import {
  sweetTopSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "../../libs/sweetAlert";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const CarList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState<CarsInquiry>(
    router?.query?.input
      ? JSON.parse(router?.query?.input as string)
      : initialInput
  );
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortingOpen, setSortingOpen] = useState(false);
  const [filterSortName, setFilterSortName] = useState("New");

  /** APOLLO REQUESTS **/
  const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

  const {
    loading: getCarsLoading,
    data: getCarsData,
    error: getCarsError,
    refetch: getCarsRefetch,
  } = useQuery(GET_CARS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  /** LIFECYCLES **/
  // Update cars and total when data changes
  useEffect(() => {
    if (getCarsData) {
      setCars(getCarsData?.getCars?.list || []);
      setTotal(getCarsData?.getCars?.metaCounter?.[0]?.total || 0);
    }
  }, [getCarsData]);

  useEffect(() => {
    if (router.query.input) {
      try {
        const inputObj = JSON.parse(router?.query?.input as string);
        setSearchFilter(inputObj);
        setCurrentPage(inputObj.page === undefined ? 1 : inputObj.page);
      } catch (err) {
        console.error("Failed to parse router query input:", err);
      }
    } else {
      setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
    }
  }, [router, searchFilter.page]);

  /** HANDLERS **/
  const handlePaginationChange = useCallback(
    async (event: ChangeEvent<unknown>, value: number) => {
      const updatedFilter = { ...searchFilter, page: value };
      setCurrentPage(value);
      try {
        await router.push(
          `/car?input=${JSON.stringify(updatedFilter)}`,
          `/car?input=${JSON.stringify(updatedFilter)}`,
          {
            scroll: false,
          }
        );
      } catch (err) {
        console.error("Failed to navigate:", err);
      }
    },
    [searchFilter, router]
  );

  const likeCarHandler = useCallback(
    async (user: T, id: string) => {
      try {
        if (!id) return;
        if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

        await likeTargetCar({
          variables: { input: id },
        });
        await getCarsRefetch({ input: searchFilter });

        await sweetTopSmallSuccessAlert("success", 808);
      } catch (err: any) {
        console.error("ERROR, likeCarHandler", err.message);
        sweetMixinErrorAlert(err.message).then();
      }
    },
    [likeTargetCar, getCarsRefetch, searchFilter]
  );

  const sortingClickHandler = useCallback((e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  }, []);

  const sortingCloseHandler = useCallback(() => {
    setSortingOpen(false);
    setAnchorEl(null);
  }, []);

  const sortingHandler = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      const targetId = e.currentTarget.id;
      let updatedFilter = { ...searchFilter };

      switch (targetId) {
        case "new":
          updatedFilter = {
            ...updatedFilter,
            sort: "createdAt",
            direction: Direction.ASC,
          };
          setFilterSortName("New");
          break;
        case "lowest":
          updatedFilter = {
            ...updatedFilter,
            sort: "carPrice",
            direction: Direction.ASC,
          };
          setFilterSortName("Lowest Price");
          break;
        case "highest":
          updatedFilter = {
            ...updatedFilter,
            sort: "carPrice",
            direction: Direction.DESC,
          };
          setFilterSortName("Highest Price");
          break;
        default:
          return;
      }

      setSearchFilter(updatedFilter);
      setSortingOpen(false);
      setAnchorEl(null);
    },
    [searchFilter]
  );

  /** MEMOIZED VALUES **/
  const totalPages = useMemo(
    () => Math.ceil(total / (searchFilter.limit || 9)),
    [total, searchFilter.limit]
  );

  const hasCars = useMemo(() => cars.length > 0, [cars.length]);

  if (device === "mobile") {
    return <h1>CARS MOBILE</h1>;
  } else {
    return (
      <div id="car-list-page" style={{ position: "relative" }}>
        <div className="container">
          <Box component={"div"} className={"right"}>
            <span>Sort by</span>
            <div>
              <Button
                onClick={sortingClickHandler}
                endIcon={<KeyboardArrowDownRoundedIcon />}
              >
                {filterSortName}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={sortingOpen}
                onClose={sortingCloseHandler}
                sx={{ paddingTop: "5px" }}
              >
                <MenuItem
                  onClick={sortingHandler}
                  id={"new"}
                  disableRipple
                  sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
                >
                  New
                </MenuItem>
                <MenuItem
                  onClick={sortingHandler}
                  id={"lowest"}
                  disableRipple
                  sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
                >
                  Lowest Price
                </MenuItem>
                <MenuItem
                  onClick={sortingHandler}
                  id={"highest"}
                  disableRipple
                  sx={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
                >
                  Highest Price
                </MenuItem>
              </Menu>
            </div>
          </Box>
          <Stack className={"car-page"}>
            <Stack className={"filter-config"}>
              {/* @ts-ignore */}
              <Filter
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                initialInput={initialInput}
              />
            </Stack>
            <Stack className="main-config" mb={"76px"}>
              <Stack className={"list-config"}>
                {getCarsLoading ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: "100%", minHeight: "400px" }}
                  >
                    <CircularProgress />
                  </Stack>
                ) : getCarsError ? (
                  <div className={"no-data"}>
                    <img src="/img/icons/icoAlert.svg" alt="" />
                    <p>Error loading cars. Please try again.</p>
                  </div>
                ) : !hasCars ? (
                  <div className={"no-data"}>
                    <img src="/img/icons/icoAlert.svg" alt="" />
                    <p>No Cars found!</p>
                  </div>
                ) : (
                  cars.map((car: Car) => (
                    <CarCard
                      car={car}
                      likeCarHandler={likeCarHandler}
                      key={car?._id}
                    />
                  ))
                )}
              </Stack>
              <Stack className="pagination-config">
                {hasCars && (
                  <>
                    <Stack className="pagination-box">
                      <Pagination
                        page={currentPage}
                        count={totalPages}
                        onChange={handlePaginationChange}
                        shape="circular"
                        color="primary"
                      />
                    </Stack>
                    <Stack className="total-result">
                      <Typography>
                        Total {total} car{total > 1 ? "s" : ""} available
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        </div>
      </div>
    );
  }
};

CarList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    sort: "createdAt",
    direction: "DESC",
    search: {
      mileageRange: {
        start: 0,
        end: 1000000,
      },
      pricesRange: {
        start: 0,
        end: 2000000,
      },
    },
  },
};

export default withLayoutBasic(CarList);
