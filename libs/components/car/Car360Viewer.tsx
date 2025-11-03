import React, { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import Panorama360Modal from "../common/Panorama360Modal";

interface Car360ViewerProps {
  car360Images: string[];
  buttonText?: string;
  variant?: "button" | "thumbnail";
}

const Car360Viewer: React.FC<Car360ViewerProps> = ({
  car360Images,
  buttonText = "View 360°",
  variant = "button",
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!car360Images || car360Images.length === 0) {
    return null;
  }

  if (variant === "thumbnail") {
    return (
      <>
        <div
          onClick={() => setShowModal(true)}
          style={{
            position: "relative",
            cursor: "pointer",
            borderRadius: "8px",
            overflow: "hidden",
            width: "100px",
            height: "100px",
          }}
        >
          <img
            src={`${process.env.REACT_APP_API_URL}/${car360Images[0]}`}
            alt="360° Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            360°
          </div>
        </div>

        <Panorama360Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          images={car360Images}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setShowModal(true)}
        sx={{
          borderColor: "#181A20",
          color: "#181A20",
          "&:hover": {
            borderColor: "#181A20",
            backgroundColor: "rgba(24, 26, 32, 0.04)",
          },
        }}
      >
        <Typography>{buttonText}</Typography>
      </Button>

      <Panorama360Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        images={car360Images}
      />
    </>
  );
};

export default Car360Viewer;
