import React from "react";
import { Modal, Box } from "@mui/material";
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
  const [viewport, setViewport] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
      }}
    >
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          position: "relative",
          borderRadius: 0,
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        <Panorama360Viewer
          images={images}
          width={viewport.width || 1920}
          height={viewport.height || 1080}
          onClose={onClose}
        />
      </Box>
    </Modal>
  );
};

export default Panorama360Modal;
