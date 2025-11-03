import React, { useEffect, useRef, useState } from "react";
import { Stack, Typography, IconButton, Box } from "@mui/material";
import * as THREE from "three";
import { REACT_APP_API_URL } from "../../config";

interface Panorama360ViewerProps {
  images: string[];
  width?: number;
  height?: number;
  onClose?: () => void;
}

const Panorama360Viewer: React.FC<Panorama360ViewerProps> = ({
  images,
  width = 800,
  height = 600,
  onClose,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const sphereRef = useRef<THREE.Mesh>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mouse/touch interaction variables
  const isUserInteracting = useRef(false);
  const onPointerDownPointerX = useRef(0);
  const onPointerDownPointerY = useRef(0);
  const onPointerDownLon = useRef(0);
  const onPointerDownLat = useRef(0);
  const lon = useRef(0);
  const lat = useRef(0);
  const phi = useRef(0);
  const theta = useRef(0);

  useEffect(() => {
    if (!mountRef.current || images.length === 0) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Create sphere geometry for 360° image
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Flip the geometry inside out
    geometry.scale(-1, 1, 1);

    // Create material with the first image
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    sphereRef.current = mesh;

    // Load the current image
    loadImage(currentImageIndex);

    // Add event listeners for interaction
    const canvas = renderer.domElement;
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onDocumentMouseWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onDocumentMouseWheel);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [width, height, images.length]);

  useEffect(() => {
    loadImage(currentImageIndex);
  }, [currentImageIndex]);

  const loadImage = (index: number) => {
    if (!images[index] || !sphereRef.current) return;

    setIsLoading(true);
    setError(null);

    const loader = new THREE.TextureLoader();
    const imagePath = `${REACT_APP_API_URL}/${images[index]}`;

    loader.load(
      imagePath,
      (texture) => {
        if (sphereRef.current) {
          (sphereRef.current.material as THREE.MeshBasicMaterial).map = texture;
          (sphereRef.current.material as THREE.MeshBasicMaterial).needsUpdate =
            true;
        }
        setIsLoading(false);
      },
      (progress) => {
        // Loading progress
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("Error loading 360° image:", error);
        setError("Failed to load 360° image");
        setIsLoading(false);
      }
    );
  };

  const onPointerDown = (event: PointerEvent) => {
    isUserInteracting.current = true;
    onPointerDownPointerX.current = event.clientX;
    onPointerDownPointerY.current = event.clientY;
    onPointerDownLon.current = lon.current;
    onPointerDownLat.current = lat.current;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!isUserInteracting.current) return;

    lon.current =
      (onPointerDownPointerX.current - event.clientX) * 0.1 +
      onPointerDownLon.current;
    lat.current =
      (event.clientY - onPointerDownPointerY.current) * 0.1 +
      onPointerDownLat.current;
  };

  const onPointerUp = () => {
    isUserInteracting.current = false;
  };

  const onDocumentMouseWheel = (event: WheelEvent) => {
    if (!cameraRef.current) return;

    const fov = cameraRef.current.fov + event.deltaY * 0.05;
    cameraRef.current.fov = THREE.MathUtils.clamp(fov, 10, 75);
    cameraRef.current.updateProjectionMatrix();
  };

  const update = () => {
    if (!cameraRef.current) return;

    lat.current = Math.max(-85, Math.min(85, lat.current));
    phi.current = THREE.MathUtils.degToRad(90 - lat.current);
    theta.current = THREE.MathUtils.degToRad(lon.current);

    const x = 500 * Math.sin(phi.current) * Math.cos(theta.current);
    const y = 500 * Math.cos(phi.current);
    const z = 500 * Math.sin(phi.current) * Math.sin(theta.current);

    cameraRef.current.lookAt(x, y, z);
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <Box
      className="panorama-viewer"
      sx={{ position: "relative", width, height }}
    >
      {/* Close button */}
      {onClose && (
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          ✕
        </IconButton>
      )}

      {/* Three.js canvas container */}
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: isUserInteracting.current ? "grabbing" : "grab",
        }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            zIndex: 999,
          }}
        >
          <Typography>Loading 360° Image...</Typography>
        </Box>
      )}

      {/* Error overlay */}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            zIndex: 999,
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Navigation controls for multiple images */}
      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={prevImage}
            disabled={currentImageIndex === 0}
            sx={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
              "&:disabled": {
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "rgba(255,255,255,0.5)",
              },
            }}
          >
            ←
          </IconButton>

          <Typography
            sx={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {currentImageIndex + 1} / {images.length}
          </Typography>

          <IconButton
            onClick={nextImage}
            disabled={currentImageIndex === images.length - 1}
            sx={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
              "&:disabled": {
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "rgba(255,255,255,0.5)",
              },
            }}
          >
            →
          </IconButton>
        </Stack>
      )}

      {/* Instructions */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 1000,
        }}
      >
        Drag to look around • Scroll to zoom
      </Box>
    </Box>
  );
};

export default Panorama360Viewer;
