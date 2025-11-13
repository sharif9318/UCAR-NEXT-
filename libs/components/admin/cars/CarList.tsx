import React from "react";
import Link from "next/link";
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableContainer,
  Button,
  Menu,
  Fade,
  MenuItem,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Stack } from "@mui/material";
import { Car } from "../../../types/car/car";
import { REACT_APP_API_URL } from "../../../config";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { CarStatus } from "../../../enums/car.enum";

interface Data {
  id: string;
  title: string;
  price: string;
  agent: string;
  location: string;
  type: string;
  status: string;
}

type Order = "asc" | "desc";

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "MB ID",
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "TITLE",
  },
  {
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "PRICE",
  },
  {
    id: "agent",
    numeric: false,
    disablePadding: false,
    label: "AGENT",
  },
  {
    id: "location",
    numeric: false,
    disablePadding: false,
    label: "LOCATION",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "TYPE",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "STATUS",
  },
];

const EnhancedTableHead: React.FC = () => {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface CarPanelListType {
  cars: Car[];
  anchorEl: (HTMLElement | null)[];
  handleMenuIconClick?: (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => void;
  menuIconClickHandler?: (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => void;
  handleMenuIconClose?: () => void;
  menuIconCloseHandler?: () => void;
  updateCar?: (car: Car) => void;
  updateCarHandler?: (car: Car) => void;
  removeCar?: (carId: string) => void;
  removeCarHandler?: (carId: string) => void;
}

export const CarPanelList = (props: CarPanelListType) => {
  const {
    cars,
    anchorEl,
    handleMenuIconClick,
    menuIconClickHandler,
    handleMenuIconClose,
    menuIconCloseHandler,
    updateCar,
    updateCarHandler,
    removeCar,
    removeCarHandler,
  } = props;

  const onMenuClick = handleMenuIconClick || menuIconClickHandler;
  const onMenuClose = handleMenuIconClose || menuIconCloseHandler;
  const onUpdateCar = updateCar || updateCarHandler;
  const onRemoveCar = removeCar || removeCarHandler;

  return (
    <Stack>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={"medium"}
        >
          <EnhancedTableHead />
          <TableBody>
            {cars.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <span className={"no-data"}>No data found!</span>
                </TableCell>
              </TableRow>
            )}

            {cars.length !== 0 &&
              cars.map((car: Car, index: number) => {
                const carImage =
                  car?.carImages && car.carImages.length > 0
                    ? `${REACT_APP_API_URL}/${car.carImages[0]}`
                    : "/img/banner/header1.svg";

                return (
                  <TableRow
                    hover
                    key={car?._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{car._id}</TableCell>
                    <TableCell align="left" className={"name"}>
                      {car.carStatus === CarStatus.ACTIVE ? (
                        <Stack direction={"row"} alignItems="center">
                          <Link href={`/car/detail?id=${car?._id}`}>
                            <Avatar
                              alt={car.carTitle}
                              src={carImage}
                              className={"car-avatar"}
                            />
                          </Link>
                          <Link href={`/car/detail?id=${car?._id}`}>
                            <div className={"car-title-link"}>
                              {car.carTitle}
                            </div>
                          </Link>
                        </Stack>
                      ) : (
                        <Stack direction={"row"} alignItems="center">
                          <Avatar
                            alt={car.carTitle}
                            src={carImage}
                            className={"car-avatar"}
                          />
                          <div>{car.carTitle}</div>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      ${car.carPrice?.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      {car.memberData?.memberNick || "N/A"}
                    </TableCell>
                    <TableCell align="center">{car.carLocation}</TableCell>
                    <TableCell align="center">{car.carType}</TableCell>
                    <TableCell align="center">
                      {car.carStatus === CarStatus.DELETE && (
                        <Button
                          variant="outlined"
                          className={"car-delete-btn"}
                          onClick={() => onRemoveCar && onRemoveCar(car._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      )}

                      {car.carStatus === CarStatus.SOLD && (
                        <Button className={"badge warning"}>
                          {car.carStatus}
                        </Button>
                      )}

                      {car.carStatus === CarStatus.ACTIVE && (
                        <>
                          <Button
                            onClick={(e: React.MouseEvent<HTMLElement>) =>
                              onMenuClick && onMenuClick(e, index)
                            }
                            className={"badge success"}
                          >
                            {car.carStatus}
                          </Button>

                          <Menu
                            className={"menu-modal"}
                            MenuListProps={{
                              "aria-labelledby": "fade-button",
                            }}
                            anchorEl={anchorEl[index]}
                            open={Boolean(anchorEl[index])}
                            onClose={onMenuClose}
                            TransitionComponent={Fade}
                            sx={{ p: 1 }}
                          >
                            {Object.values(CarStatus)
                              .filter((ele) => ele !== car.carStatus)
                              .map((status: string) => (
                                <MenuItem
                                  onClick={() => {
                                    if (onUpdateCar) {
                                      onUpdateCar({
                                        _id: car._id,
                                        carStatus: status,
                                      } as Car);
                                    }
                                    if (onMenuClose) onMenuClose();
                                  }}
                                  key={status}
                                >
                                  <Typography
                                    variant={"subtitle1"}
                                    component={"span"}
                                  >
                                    {status}
                                  </Typography>
                                </MenuItem>
                              ))}
                          </Menu>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
