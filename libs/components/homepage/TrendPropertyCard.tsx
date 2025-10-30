import React, { useRef, useState } from "react";
import { Stack, Box, Typography, IconButton } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Property } from "../../types/property/property";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface TrendPropertyCardProps {
  property: Property;
  likePropertyHandler: any;
  index: number;
}

const TrendPropertyCard = (props: TrendPropertyCardProps) => {
  const { property, likePropertyHandler, index } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Find video file in propertyImages
  const videoFile = property.propertyImages?.find(
    (img) =>
      img.includes(".mp4") || img.includes(".webm") || img.includes(".mov")
  );

  // Fallback to first image if no video
  const mediaFile = videoFile || property.propertyImages?.[0];
  const isVideo = videoFile ? true : false;

  /** HANDLERS **/

  const pushDetailHandler = async (propertyId: string) => {
    console.log("propertyId:", propertyId);
    await router.push({
      pathname: "/property/detail",
      query: { id: propertyId },
    });
  };

  if (device === "mobile") {
    return (
      <Stack className="trend-card-box" key={property._id}>
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
                onClick={() => pushDetailHandler(property._id)}
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
                onClick={() => pushDetailHandler(property._id)}
              />
            )}

            <Box className="netflix-badge">N</Box>
            <div className="price-badge">${property.propertyPrice}</div>

            <Box className="info">
              <strong className={"title"}>{property.propertyTitle}</strong>
            </Box>
          </Box>
        </Box>

        <Box className="bott">
          <div className="view-like-box">
            <IconButton size="small" color={"default"}>
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
            <Typography className="view-cnt">
              {property?.propertyViews}
            </Typography>
            <IconButton
              size="small"
              color={"default"}
              onClick={() => likePropertyHandler(user, property?._id)}
            >
              {property?.meLiked && property?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon style={{ color: "red" }} fontSize="small" />
              ) : (
                <FavoriteIcon fontSize="small" />
              )}
            </IconButton>
            <Typography className="view-cnt">
              {property?.propertyLikes}
            </Typography>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack className="trend-card-box" key={property._id}>
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
                onClick={() => pushDetailHandler(property._id)}
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
                onClick={() => pushDetailHandler(property._id)}
              />
            )}

            <Box className="logo">
              <img src="/img/logo/ucar_logo (1)2.svg" />
            </Box>
            <div className="price-badge">{property.propertyPrice}₩</div>

            <Box className="info">
              <strong className={"title"}>{property.propertyTitle}</strong>
            </Box>
          </Box>
        </Box>

        <Box className="bott">
          <div className="view-like-box">
            <IconButton size="small" sx={{ color: "white" }}>
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
            <Typography className="view-cnt">
              {property?.propertyViews}
            </Typography>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => likePropertyHandler(user, property?._id)}
            >
              {property?.meLiked && property?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon style={{ color: "red" }} fontSize="small" />
              ) : (
                <FavoriteIcon fontSize="small" />
              )}
            </IconButton>
            <Typography className="view-cnt">
              {property?.propertyLikes}
            </Typography>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default TrendPropertyCard;
