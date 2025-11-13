import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../../libs/components/layout/LayoutAdmin";
import { Box, List, ListItem, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TabContext } from "@mui/lab";
import TablePagination from "@mui/material/TablePagination";
import { CarPanelList } from "../../../libs/components/admin/cars/CarList";
import { AllCarsInquiry } from "../../../libs/types/car/car.input";
import { Car } from "../../../libs/types/car/car";
import { CarLocation, CarStatus } from "../../../libs/enums/car.enum";
import {
  sweetConfirmAlert,
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../libs/sweetAlert";
import { CarUpdate } from "../../../libs/types/car/car.update";
import withI18n from "../../../libs/i18n/withI18n";
import {
  REMOVE_CAR_BY_ADMIN,
  UPDATE_CAR_BY_ADMIN,
} from "../../../apollo/admin/mutation";
import { GET_ALL_CARS_BY_ADMIN } from "../../../apollo/admin/query";
import { useMutation, useQuery } from "@apollo/client";
import { T } from "../../../libs/types/common";

const AdminCars: NextPage = ({ initialInquiry, ...props }: any) => {
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>([]);
  const [carsInquiry, setCarsInquiry] =
    useState<AllCarsInquiry>(initialInquiry);
  const [cars, setCars] = useState<Car[]>([]);
  const [carsTotal, setCarsTotal] = useState<number>(0);
  const [value, setValue] = useState(
    carsInquiry?.search?.carStatus ? carsInquiry?.search?.carStatus : "ALL"
  );
  const [searchType, setSearchType] = useState("ALL");

  /** APOLLO REQUESTS **/
  const [updateCarByAdmin] = useMutation(UPDATE_CAR_BY_ADMIN);
  const [removeCarByAdmin] = useMutation(REMOVE_CAR_BY_ADMIN);

  const {
    loading: getAllCarsByAdminLoading,
    data: getAllCarsByAdminData,
    error: getAllCarsByAdminError,
    refetch: getAllCarsRefetch,
  } = useQuery(GET_ALL_CARS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: carsInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setCars(data?.getAllCarsByAdmin?.list || []);
      setCarsTotal(data?.getAllCarsByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getAllCarsRefetch({ input: carsInquiry });
  }, [carsInquiry]);

  /** HANDLERS **/
  const changePageHandler = async (event: unknown, newPage: number) => {
    setCarsInquiry({ ...carsInquiry, page: newPage + 1 });
  };

  const changeRowsPerPageHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCarsInquiry({
      ...carsInquiry,
      limit: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const menuIconClickHandler = (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const tempAnchor = [...anchorEl];
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };

  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);
    const newInquiry = { ...carsInquiry, page: 1, sort: "createdAt" };

    switch (newValue) {
      case "ACTIVE":
        newInquiry.search = { carStatus: CarStatus.ACTIVE };
        break;
      case "SOLD":
        newInquiry.search = { carStatus: CarStatus.SOLD };
        break;
      case "DELETE":
        newInquiry.search = { carStatus: CarStatus.DELETE };
        break;
      default:
        newInquiry.search = {};
        break;
    }

    setCarsInquiry(newInquiry);
  };

  const removeCarHandler = async (id: string) => {
    try {
      if (
        await sweetConfirmAlert("Are you sure you want to remove this car?")
      ) {
        await removeCarByAdmin({
          variables: { carId: id },
        });
        await sweetTopSmallSuccessAlert("Car removed successfully!", 800);
        await getAllCarsRefetch({ input: carsInquiry });
      }
      menuIconCloseHandler();
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const searchTypeHandler = async (newValue: string) => {
    try {
      setSearchType(newValue);
      const newInquiry = { ...carsInquiry, page: 1, sort: "createdAt" };

      if (newValue !== "ALL") {
        newInquiry.search = {
          ...carsInquiry.search,
          carLocationList: [newValue as CarLocation],
        };
      } else {
        delete newInquiry.search?.carLocationList;
      }

      setCarsInquiry(newInquiry);
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };

  const updateCarHandler = async (updateData: CarUpdate) => {
    try {
      await updateCarByAdmin({
        variables: { input: updateData },
      });
      await sweetTopSmallSuccessAlert("Car updated successfully!", 800);
      await getAllCarsRefetch({ input: carsInquiry });
      menuIconCloseHandler();
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box component={"div"} className={"content"}>
      <Typography variant={"h2"} className={"tit"} sx={{ mb: "24px" }}>
        Car List
      </Typography>
      <Box component={"div"} className={"table-wrap"}>
        <Box component={"div"} sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box component={"div"}>
              <List className={"tab-menu"}>
                <ListItem
                  onClick={(e) => tabChangeHandler(e, "ALL")}
                  className={value === "ALL" ? "li on" : "li"}
                >
                  All
                </ListItem>
                <ListItem
                  onClick={(e) => tabChangeHandler(e, "ACTIVE")}
                  className={value === "ACTIVE" ? "li on" : "li"}
                >
                  Active
                </ListItem>
                <ListItem
                  onClick={(e) => tabChangeHandler(e, "SOLD")}
                  className={value === "SOLD" ? "li on" : "li"}
                >
                  Sold
                </ListItem>
                <ListItem
                  onClick={(e) => tabChangeHandler(e, "DELETE")}
                  className={value === "DELETE" ? "li on" : "li"}
                >
                  Delete
                </ListItem>
              </List>
              <Divider />
              <Stack className={"search-area"} sx={{ m: "24px" }}>
                <Select sx={{ width: "160px", mr: "20px" }} value={searchType}>
                  <MenuItem
                    value={"ALL"}
                    onClick={() => searchTypeHandler("ALL")}
                  >
                    ALL
                  </MenuItem>
                  {Object.values(CarLocation).map((location: string) => (
                    <MenuItem
                      value={location}
                      onClick={() => searchTypeHandler(location)}
                      key={location}
                    >
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Divider />
            </Box>
            <CarPanelList
              cars={cars}
              anchorEl={anchorEl}
              menuIconClickHandler={menuIconClickHandler}
              menuIconCloseHandler={menuIconCloseHandler}
              updateCarHandler={updateCarHandler}
              removeCarHandler={removeCarHandler}
            />

            <TablePagination
              rowsPerPageOptions={[10, 20, 40, 60]}
              component="div"
              count={carsTotal}
              rowsPerPage={carsInquiry?.limit}
              page={carsInquiry?.page - 1}
              onPageChange={changePageHandler}
              onRowsPerPageChange={changeRowsPerPageHandler}
            />
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
};

AdminCars.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 10,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default withI18n()(withAdminLayout(AdminCars));
