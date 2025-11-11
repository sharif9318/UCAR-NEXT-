import React, { useState } from "react";
import { Stack, Box, Divider, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Car } from "../../types/car/car";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SpeedIcon from "@mui/icons-material/Speed";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { REACT_APP_API_URL, topCarRank } from "../../config";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface PopularCarCardProps {
  car: Car;
}

const PopularCarCard = (props: PopularCarCardProps) => {
  const { car } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  /** HANDLERS **/

  const pushDetailHandler = async (carId: string) => {
    console.log("carId:", carId);
    await router.push({
      pathname: "/car/detail",
      query: { id: carId },
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Background scene and car image
  const backgroundScene = car?.carImages[1] || car?.carImages[0] || "";
  const carForeground = car?.carImages[0] || "";

  if (device === "mobile") {
    return (
      <Stack className="popular-card-box">
        <Box
          component={"div"}
          className={"card-img"}
          style={{
            backgroundImage: `url(${REACT_APP_API_URL}/${backgroundScene})`,
          }}
          onClick={() => pushDetailHandler(car._id)}
        >
          {car && car?.carRank >= topCarRank && (
            <div className={"status"}>
              <img src="/img/icons/electricity.svg" alt="" />
              <span>top</span>
            </div>
          )}
        </Box>

        {/* Car foreground image - draggable */}
        <img
          src={`${REACT_APP_API_URL}/${carForeground}`}
          alt={car.carTitle}
          className="car-foreground"
          draggable="false"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        />

        <Box component={"div"} className={"info"}>
          <div className="title-section">
            <Typography variant="h6" className="model-title">
              {car.carTitle}
            </Typography>
            <Typography variant="caption" className="starting-text">
              Starting at ${car.carPrice}
            </Typography>
            <Typography variant="caption" className="msrp-text">
              As shown ${car.carPrice}
            </Typography>
          </div>

          <strong className={"address"}>{car.carAddress}</strong>

          <div className={"options"}>
            <div>
              <img src="/img/icons/year.svg" alt="" />
              <span>{car?.carYear} year</span>
            </div>
            <div>
              <EventSeatIcon sx={{ fontSize: 18 }} />
              <span>{car?.carSeats} seats</span>
            </div>
            <div>
              <SpeedIcon sx={{ fontSize: 18 }} />
              <span>{car?.carMileage} km</span>
            </div>
          </div>
          <Divider sx={{ mt: "15px", mb: "17px" }} />
          <div className={"bott"}>
            <p>{car?.carLease ? "lease" : "sale"}</p>
            <div className="view-like-box">
              <IconButton color={"default"}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{car?.carViews}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack className="popular-card-box">
        <img
          src="/img/car/background.jpg"
          alt={car.carTitle}
          className="card-img"
        />
        <img
          src="/img/car/sampleCar.png"
          alt={car.carTitle}
          className="car-foreground"
          draggable="true"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        />

        <Box component={"div"} className={"info"}>
          <div className="title-section">
            <Typography variant="h6" className="model-title">
              {car.carTitle}
            </Typography>
            <Typography variant="caption" className="starting-text">
              Starting at ${car.carPrice}
            </Typography>
          </div>

          <div className={"options"}>
            <div>
              <img src="/img/icons/year.svg" alt="Year" />
              <span>{car?.carYear || "N/A"} year</span>
            </div>
            <div>
              <EventSeatIcon sx={{ fontSize: 18 }} />
              <span>{car?.carSeats || "N/A"} seats</span>
            </div>
            <div>
              <SpeedIcon sx={{ fontSize: 18 }} />
              <span>{car?.carMileage || "N/A"} km</span>
            </div>
          </div>

          <div className={"bott"}>
            <p>{car?.carLease ? "lease" : "sale"}</p>
            <div className="view-like-box">
              <IconButton color={"default"}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{car?.carViews}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default PopularCarCard;
