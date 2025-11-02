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
          >
            <img
              src={imagePath}
              alt={car?.carTitle || "Car image"}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Link>
          {isTopCar && (
            <Box component={"div"} className={"top-badge"}>
              <img src="/img/icons/electricity.svg" alt="Top car badge" />
              <Typography>TOP</Typography>
            </Box>
          )}
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
              <img src="/img/icons/year.svg" alt="" />{" "}
              <Typography>{car.carYear} year</Typography>
            </Stack>
            <Stack className="option">
              <img src="/img/icons/seat.svg" alt="" />{" "}
              <Typography>{car.carSeats} seat</Typography>
            </Stack>
            <Stack className="option">
              <img src="/img/icons/expand.svg" alt="" />{" "}
              <Typography>{car.carMileage} km</Typography>
            </Stack>
          </Stack>
          <Stack className="divider"></Stack>
          <Stack className="type-buttons">
            <Stack className="type">
              <Typography
                sx={{ fontWeight: 500, fontSize: "13px" }}
                className={car.carLease ? "" : "disabled-type"}
              >
                Lease
              </Typography>
              <Typography
                sx={{ fontWeight: 500, fontSize: "13px" }}
                className={car.carTradeIn ? "" : "disabled-type"}
              >
                Trade-In
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
                    <FavoriteIcon color="primary" />
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
