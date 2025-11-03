import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import Panorama360Viewer from "./Panorama360Viewer";

interface Panorama360ModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
}

const Panorama360Modal: React.FC<Panorama360ModalProps> = ({
  open,
  onClose,
  images,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
      }}
    >
      <Box
        sx={{
          width: "90vw",
          height: "90vh",
          maxWidth: "1200px",
          maxHeight: "800px",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        <Panorama360Viewer
          images={images}
          width={
            typeof window !== "undefined"
              ? Math.min(window.innerWidth * 0.9, 1200)
              : 1200
          }
          height={
            typeof window !== "undefined"
              ? Math.min(window.innerHeight * 0.9, 800)
              : 800
          }
          onClose={onClose}
        />
      </Box>
    </Modal>
  );
};

export default Panorama360Modal;
