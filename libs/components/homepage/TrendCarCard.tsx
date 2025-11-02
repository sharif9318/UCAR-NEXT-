import React, { useRef, useState } from "react";
import { Stack, Box, Typography, IconButton } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Car } from "../../types/car/car";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface TrendCarCardProps {
  car: Car;
  likeCarHandler: any;
  index: number;
}

const TrendCarCard = (props: TrendCarCardProps) => {
  const { car, likeCarHandler, index } = props;
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
      <Stack className="trend-card-box" key={car._id}>
        <Box className="card-wrapper">
          <Typography className="rank-number">{index + 1}</Typography>

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

            <Box className="netflix-badge">UCAR</Box>
            <div className="price-badge">${car.carPrice}</div>

            <Box className="info">
              <strong className={"title"}>{car.carTitle}</strong>
            </Box>
          </Box>
        </Box>

        <Box className="bott">
          <div className="view-like-box">
            <IconButton size="small" color={"default"}>
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
            <Typography className="view-cnt">{car?.carViews}</Typography>
            <IconButton
              size="small"
              color={"default"}
              onClick={() => likeCarHandler(user, car?._id)}
            >
              {car?.meLiked && car?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon style={{ color: "red" }} fontSize="small" />
              ) : (
                <FavoriteIcon fontSize="small" />
              )}
            </IconButton>
            <Typography className="view-cnt">{car?.carLikes}</Typography>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack className="trend-card-box" key={car._id}>
        <Box className="card-wrapper">
          <Typography className="rank-number">{index + 1}</Typography>

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

            <Box className="logo">
              <img src="/img/logo/ucar_logo (1)2.svg" />
            </Box>
            <div className="price-badge">{car.carPrice}₩</div>

            <Box className="info">
              <strong className={"title"}>{car.carTitle}</strong>
            </Box>
          </Box>
        </Box>

        <Box className="bott">
          <div className="view-like-box">
            <IconButton size="small" sx={{ color: "white" }}>
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
            <Typography className="view-cnt">{car?.carViews}</Typography>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => likeCarHandler(user, car?._id)}
            >
              {car?.meLiked && car?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon style={{ color: "red" }} fontSize="small" />
              ) : (
                <FavoriteIcon fontSize="small" />
              )}
            </IconButton>
            <Typography className="view-cnt">{car?.carLikes}</Typography>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default TrendCarCard;
