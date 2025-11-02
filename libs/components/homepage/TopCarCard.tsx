import React, { useRef, useState } from "react";
import { Stack, Box, Divider, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Car } from "../../types/car/car";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface TopCarCardProps {
  property: Car;
  likeCarHandler: any;
}

const TopCarCard = (props: TopCarCardProps) => {
  const { property, likeCarHandler } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Find video file in carImages
  const videoFile = car.carImages?.find(
    (img) =>
      img.includes(".mp4") || img.includes(".webm") || img.includes(".mov")
  );

  // Fallback to first image if no video
  const mediaFile = videoFile || car.carImages?.[0];
  const isVideo = videoFile ? true : false;

  /** HANDLERS **/

  const pushDetailHandler = async (carId: string) => {
    console.log("carId:", carId);
    await router.push({
      pathname: "/car/detail",
      query: { id: carId },
    });
  };

  if (device === "mobile") {
    return (
      <Stack className="top-card-box">
        <Box component={"div"} className={"card-img"}>
          {isVideo ? (
            <video
              ref={videoRef}
              className="card-video"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              onClick={() => pushDetailHandler(car._id)}
            >
              <source
                src={`${REACT_APP_API_URL}/${mediaFile}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div
              className="card-image"
              style={{
                backgroundImage: `url(${REACT_APP_API_URL}/${mediaFile})`,
              }}
              onClick={() => pushDetailHandler(car._id)}
            />
          )}

          <div>${car?.carPrice}</div>
        </Box>
        <Box component={"div"} className={"info"}>
          <strong
            className={"title"}
            onClick={() => pushDetailHandler(car._id)}
          >
            {car?.carTitle}
          </strong>
          <p className={"desc"}>{car?.carAddress}</p>
          <div className={"options"}>
            <div>
              <img src="/img/icons/year.svg" alt="" />
              <span>{car?.carYear} year</span>
            </div>
            <div>
              <img src="/img/icons/seat.svg" alt="" />
              <span>{car?.carSeats} seats</span>
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{car?.carMileage} km</span>
            </div>
          </div>
          <Divider sx={{ mt: "15px", mb: "17px" }} />
          <div className={"bott"}>
            <p>
              {" "}
              {car.carLease ? "Lease" : ""}{" "}
              {car.carLease && car.carTradeIn && "/"}{" "}
              {car.carTradeIn ? "Trade-In" : ""}
            </p>
            <div className="view-like-box">
              <IconButton color={"default"}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{car?.carViews}</Typography>
              <IconButton
                color={"default"}
                onClick={() => likeCarHandler(user, car?._id)}
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
  } else {
    return (
      <Stack className="top-card-box">
        <Box component={"div"} className={"card-img"}>
          {isVideo ? (
            <video
              ref={videoRef}
              className="card-video"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              onClick={() => pushDetailHandler(car._id)}
            >
              <source
                src={`${REACT_APP_API_URL}/${mediaFile}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div
              className="card-image"
              style={{
                backgroundImage: `url(${REACT_APP_API_URL}/${mediaFile})`,
              }}
              onClick={() => pushDetailHandler(car._id)}
            />
          )}
          <div>${car?.carPrice}</div>
        </Box>
        <Box component={"div"} className={"info"}>
          <strong
            className={"title"}
            onClick={() => pushDetailHandler(car._id)}
          >
            {car?.carTitle}
          </strong>
          <p className={"desc"}>{car?.carAddress}</p>
          <div className={"options"}>
            <div>
              <img src="/img/icons/year.svg" alt="" />
              <span>{car?.carYear} year</span>
            </div>
            <div>
              <img src="/img/icons/seat.svg" alt="" />
              <span>{car?.carSeats} seats</span>
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{car?.carMileage} km</span>
            </div>
          </div>
          <Divider sx={{ mt: "15px", mb: "17px" }} />
          <div className={"bott"}>
            <p>
              {" "}
              {car.carLease ? "Lease" : ""}{" "}
              {car.carLease && car.carTradeIn && "/"}{" "}
              {car.carTradeIn ? "Trade-In" : ""}
            </p>
            <div className="view-like-box">
              <IconButton color={"default"}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{car?.carViews}</Typography>
              <IconButton
                color={"default"}
                onClick={() => likeCarHandler(user, car?._id)}
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

export default TopCarCard;
