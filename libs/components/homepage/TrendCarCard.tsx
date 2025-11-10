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

const TrendCarCardContent = ({
  car,
  index,
  isVideo,
  videoRef,
  mediaFile,
  pushDetailHandler,
  likeCarHandler,
  user,
  badge,
  price,
  iconButtonProps,
  cardImgClass,
  priceBadgeClass,
  setIsVideoLoaded,
}: any) => (
  <Stack className="trend-card-box" key={car._id}>
    <Box className="card-wrapper">
      <Typography className="rank-number">{index + 1}</Typography>
      <Box component={"div"} className={cardImgClass}>
        {isVideo ? (
          <video
            ref={videoRef}
            className="card-video"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded && setIsVideoLoaded(true)}
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
        {badge}
        <div className={priceBadgeClass}>{price}</div>
        <Box className="info">
          <strong className={"title"}>{car.carTitle}</strong>
        </Box>
      </Box>
    </Box>
    <Box className="bott">
      <div className="view-like-box">
        <IconButton size="small" {...iconButtonProps}>
          <RemoveRedEyeIcon fontSize="small" />
        </IconButton>
        <Typography className="view-cnt">{car?.carViews}</Typography>
        <IconButton
          size="small"
          {...iconButtonProps}
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

const TrendCarCard = (props: TrendCarCardProps) => {
  const { car, likeCarHandler, index } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Check for video in carVideos field
  const videoFile = car.carVideos?.[0];
  // Use video if available, otherwise use first image
  const mediaFile = videoFile || car.carImages?.[0];
  const isVideo = !!videoFile;

  /** HANDLERS **/
  const pushDetailHandler = async (carId: string) => {
    await router.push({
      pathname: "/car/detail",
      query: { id: carId },
    });
  };

  return device === "mobile" ? (
    <TrendCarCardContent
      car={car}
      index={index}
      isVideo={isVideo}
      videoRef={videoRef}
      mediaFile={mediaFile}
      pushDetailHandler={pushDetailHandler}
      likeCarHandler={likeCarHandler}
      user={user}
      badge={<Box className="netflix-badge">UCAR</Box>}
      price={`$${car.carPrice}`}
      iconButtonProps={{ color: "default" }}
      cardImgClass={"card-img"}
      priceBadgeClass={"price-badge"}
      setIsVideoLoaded={setIsVideoLoaded}
    />
  ) : (
    <TrendCarCardContent
      car={car}
      index={index}
      isVideo={isVideo}
      videoRef={videoRef}
      mediaFile={mediaFile}
      pushDetailHandler={pushDetailHandler}
      likeCarHandler={likeCarHandler}
      user={user}
      badge={
        <Box className="logo">
          <img src="/img/logo/ucar_logo (1)2.svg" />
        </Box>
      }
      price={`${car.carPrice}₩`}
      iconButtonProps={{ sx: { color: "white" } }}
      cardImgClass={"card-img"}
      priceBadgeClass={"price-badge"}
      setIsVideoLoaded={setIsVideoLoaded}
    />
  );
};

export default TrendCarCard;
