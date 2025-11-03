import React from "react";
import { Stack, Box, Divider, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Car } from "../../types/car/car";
import { REACT_APP_API_URL, topCarRank } from "../../config";
import { formatterStr } from "../../utils";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { useRouter } from "next/router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import moment from "moment";

interface CarBigCardProps {
  car: Car;
  likeCarHandler?: any;
}

const CarBigCard = (props: CarBigCardProps) => {
  const { car, likeCarHandler } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();

  /** HANDLERS **/
  const goCarDetailPage = (carId: string) => {
    router.push(`/car/detail?id=${carId}`);
  };

  if (device === "mobile") {
    return <div>CAR BIG CARD</div>;
  } else {
    return (
      <Stack
        className="car-big-card-box"
        onClick={() => goCarDetailPage(car?._id)}
      >
        <Box
          component={"div"}
          className={"card-img"}
          style={{
            backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages?.[0]})`,
          }}
        >
          {car && car?.carRank >= topCarRank && (
            <div className={"status"}>
              <img src="/img/icons/electricity.svg" alt="" />
              <span>Featured</span>
            </div>
          )}

          <div className={"price"}>${formatterStr(car?.carPrice)}</div>
        </Box>
        <Box component={"div"} className={"info"}>
          <strong className={"title"}>{car?.carTitle}</strong>
          <p className={"desc"}>{car?.carAddress}</p>
          <div className={"options"}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <path
                  d="M8.5 1C4.36 1 1 4.36 1 8.5C1 12.64 4.36 16 8.5 16C12.64 16 16 12.64 16 8.5C16 4.36 12.64 1 8.5 1ZM8.5 14.5C5.19 14.5 2.5 11.81 2.5 8.5C2.5 5.19 5.19 2.5 8.5 2.5C11.81 2.5 14.5 5.19 14.5 8.5C14.5 11.81 11.81 14.5 8.5 14.5Z"
                  fill="#181A20"
                />
                <path
                  d="M9 5H8V9L11.1 11.1L11.8 10.1L9 8.4V5Z"
                  fill="#181A20"
                />
              </svg>
              <span>{moment(car?.createdAt).format("YYYY")}</span>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <path
                  d="M14.92 5.01C14.72 4.42 14.16 4 13.5 4H3.5C2.84 4 2.29 4.42 2.08 5.01L0 11V19C0 19.55 0.45 20 1 20H2C2.55 20 3 19.55 3 19V18H14V19C14 19.55 14.45 20 15 20H16C16.55 20 17 19.55 17 19V11L14.92 5.01ZM3.5 15C2.67 15 2 14.33 2 13.5C2 12.67 2.67 12 3.5 12C4.33 12 5 12.67 5 13.5C5 14.33 4.33 15 3.5 15ZM13.5 15C12.67 15 12 14.33 12 13.5C12 12.67 12.67 12 13.5 12C14.33 12 15 12.67 15 13.5C15 14.33 14.33 15 13.5 15ZM2 10L3.5 5.5H13.5L15 10H2Z"
                  fill="#181A20"
                />
              </svg>
              <span>{car?.carType}</span>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <path
                  d="M14 2H3C1.9 2 1 2.9 1 4V14C1 15.1 1.9 16 3 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2ZM14 14H3V4H14V14Z"
                  fill="#181A20"
                />
                <path
                  d="M5 12H7V8H5V12ZM9 12H11V5H9V12ZM13 12H15 V7H13V12Z"
                  fill="#181A20"
                />
              </svg>
              <span>{formatterStr(car?.carMileage)} km</span>
            </div>
          </div>
          <Divider sx={{ mt: "15px", mb: "17px" }} />
          <div className={"bott"}>
            <div>
              {car?.carLease ? <p>Lease</p> : <span>Lease</span>}
              {car?.carTradeIn ? <p>Trade</p> : <span>Trade</span>}
            </div>
            <div className="buttons-box">
              <IconButton color={"default"}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{car?.carViews}</Typography>
              <IconButton
                color={"default"}
                onClick={(e) => {
                  e.stopPropagation();
                  likeCarHandler(user, car?._id);
                }}
              >
                {car?.meLiked && car?.meLiked[0]?.myFavorite ? (
                  <FavoriteIcon style={{ color: "red" }} />
                ) : (
                  <FavoriteIcon />
                )}
              </IconButton>
              <Typography className="view-cnt">{car?.carLikes}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default CarBigCard;
