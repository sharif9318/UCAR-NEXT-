import React, { memo, useMemo } from "react";
import { Stack, Typography, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Car } from "../../types/car/car";
import Link from "next/link";
import { formatterStr } from "../../utils";
import { REACT_APP_API_URL, topCarRank } from "../../config";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useTranslation } from "react-i18next";
import {
  Speed,
  EventSeat as EventSeatIcon,
  AccessTime,
} from "@mui/icons-material";

interface CarCardType {
  car: Car;
  likeCarHandler?: (user: any, id: string) => Promise<void>;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const CarCard = memo((props: CarCardType) => {
  const { car, likeCarHandler, myFavorites, recentlyVisited } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t } = useTranslation("common");

  const imagePath = useMemo(
    () =>
      car?.carImages?.[0]
        ? `${REACT_APP_API_URL}/${car.carImages[0]}`
        : "/img/banner/header1.svg",
    [car?.carImages]
  );

  const isTopCar = useMemo(
    () => car?.carRank && car.carRank > topCarRank,
    [car?.carRank]
  );

  const isLiked = useMemo(
    () => myFavorites || (car?.meLiked?.[0]?.myFavorite ?? false),
    [myFavorites, car?.meLiked]
  );

  const handleLikeClick = useMemo(
    () =>
      likeCarHandler && user?._id
        ? () => likeCarHandler(user, car?._id)
        : undefined,
    [likeCarHandler, user, car?._id]
  );

  if (device === "mobile") {
    return <div>CAR CARD</div>;
  } else {
    return (
      <Stack className="card-config">
        <Stack className="top">
          <Link
            href={{
              pathname: "/car/detail",
              query: { id: car?._id },
            }}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              textDecoration: "none",
            }}
          >
            <img
              src={imagePath}
              alt={car?.carTitle || "Car image"}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Link>
          {isTopCar && car?.carRank > topCarRank && (
            <Box component={"div"} className={"top-badge"}>
              <img src="/img/icons/electricity.svg" alt="Top car badge" />
              <Typography>TOP</Typography>
            </Box>
          )}
          {/* {car?.car360Images?.length ? (
            <Box
              component={"div"}
              className={"car360-badge"}
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                backgroundColor: "rgba(235, 103, 83, 0.95)",
                color: "white",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: "bold",
                zIndex: 2,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography sx={{ fontSize: "11px", fontWeight: "bold" }}>
                360° ({car.car360Images.length})
              </Typography>
            </Box>
          ) : null} */}
          <Box component={"div"} className={"price-box"}>
            <Typography>${formatterStr(car?.carPrice)}</Typography>
          </Box>
        </Stack>
        <Stack className="bottom">
          <Stack className="name-address">
            <Stack className="name">
              <Link
                href={{
                  pathname: "/car/detail",
                  query: { id: car?._id },
                }}
              >
                <Typography>{car.carTitle}</Typography>
              </Link>
            </Stack>
            <Stack className="address">
              <Typography>
                {car.carAddress}, {car.carLocation}
              </Typography>
            </Stack>
          </Stack>
          <Stack className="options">
            <Stack className="option">
              <AccessTime sx={{ fontSize: 18 }} />{" "}
              <Typography>
                {car.carYear} {t("car.year")}
              </Typography>
            </Stack>
            <Stack className="option">
              <EventSeatIcon sx={{ fontSize: 18 }} />{" "}
              <Typography>
                {car.carSeats} {t("car.seats")}
              </Typography>
            </Stack>
            <Stack className="option">
              <Speed sx={{ fontSize: 18 }} />{" "}
              <Typography>
                {car.carMileage} {t("car.km")}
              </Typography>
            </Stack>
          </Stack>
          <Stack className="divider"></Stack>
          <Stack className="type-buttons">
            <Stack className="type">
              <Typography
                sx={{ fontWeight: 500, fontSize: "13px" }}
                className={car.carLease ? "" : "disabled-type"}
              >
                {t("car.lease")}
              </Typography>
              <Typography
                sx={{ fontWeight: 500, fontSize: "13px" }}
                className={car.carTradeIn ? "" : "disabled-type"}
              >
                {t("car.sale")}
              </Typography>
            </Stack>
            {!recentlyVisited && (
              <Stack className="buttons">
                <IconButton color={"default"}>
                  <RemoveRedEyeIcon />
                </IconButton>
                <Typography className="view-cnt">{car?.carViews}</Typography>
                <IconButton
                  color={"default"}
                  onClick={handleLikeClick}
                  disabled={!handleLikeClick}
                >
                  {isLiked ? (
                    <FavoriteIcon color="red" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <Typography className="view-cnt">{car?.carLikes}</Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
});

CarCard.displayName = "CarCard";

export default CarCard;
