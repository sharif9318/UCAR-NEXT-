import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

// For loading 3D model files (.glb, .gltf)
function Car3DModel({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);

  return <primitive object={scene} scale={1.5} position={[0, -0.5, 0]} />;
}

// Fallback: Create a realistic-looking car from primitives
function RealisticCarModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main body with smooth curves */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[3, 0.6, 1.4]} />
        <meshStandardMaterial color="#dc143c" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hood (front) with curve */}
      <mesh position={[-1.3, 0.5, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.8, 0.4, 1.4]} />
        <meshStandardMaterial color="#dc143c" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Trunk (rear) with curve */}
      <mesh position={[1.3, 0.5, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.8, 0.4, 1.4]} />
        <meshStandardMaterial color="#dc143c" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cabin/Roof */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 1.3]} />
        <meshStandardMaterial color="#dc143c" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windshield */}
      <mesh position={[-0.6, 1.1, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.6, 0.6, 1.28]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[0.6, 1.1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.6, 0.6, 1.28]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Side windows - Left */}
      <mesh position={[0, 1, 0.72]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#222222"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Side windows - Right */}
      <mesh position={[0, 1, -0.72]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#222222"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Front bumper */}
      <mesh position={[-1.8, 0.2, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[1.8, 0.2, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Wheels - Front Left */}
      <mesh
        position={[-1, -0.1, 0.8]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1, -0.1, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.32, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels - Front Right */}
      <mesh
        position={[-1, -0.1, -0.8]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1, -0.1, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.32, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels - Rear Left */}
      <mesh position={[1, -0.1, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1, -0.1, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.32, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels - Rear Right */}
      <mesh
        position={[1, -0.1, -0.8]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1, -0.1, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.32, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-1.85, 0.4, 0.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffffcc"
          emissive="#ffffaa"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-1.85, 0.4, -0.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffffcc"
          emissive="#ffffaa"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Taillights */}
      <mesh position={[1.85, 0.4, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#cc0000"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[1.85, 0.4, -0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#cc0000"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Side mirrors - Left */}
      <mesh position={[-0.4, 1, 0.8]}>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Side mirrors - Right */}
      <mesh position={[-0.4, 1, -0.8]}>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

const Car3DSection = ({
  imageUrl,
  modelUrl,
}: {
  imageUrl?: string;
  modelUrl?: string;
}) => (
  <Box
    sx={{
      width: "100%",
      height: 400,
      background:
        "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)",
      borderRadius: 2,
      overflow: "hidden",
      position: "relative",
      boxShadow: "inset 0 0 50px rgba(0,0,0,0.5)",
    }}
  >
    <Canvas
      camera={{ position: [4, 2, 4], fov: 50 }}
      shadows
      gl={{ alpha: false, antialias: true, toneMapping: 3 }}
    >
      {/* Studio lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, 5, -5]} intensity={0.8} />
      <spotLight
        position={[0, 15, 0]}
        intensity={0.8}
        angle={0.5}
        penumbra={1}
        castShadow
      />
      <spotLight
        position={[-5, 10, 5]}
        intensity={0.5}
        angle={0.4}
        penumbra={1}
        color="#4488ff"
      />

      {/* Professional environment */}
      <Environment preset="city" />

      {/* Reflective showroom floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.9} roughness={0.1} />
      </mesh>

      <Suspense
        fallback={
          <Html center>
            <div style={{ color: "white" }}>Loading 3D Model...</div>
          </Html>
        }
      >
        {modelUrl ? <Car3DModel modelUrl={modelUrl} /> : <RealisticCarModel />}
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 8}
        autoRotate
        autoRotateSpeed={1.5}
      />
    </Canvas>

    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        left: 16,
        background: "rgba(0,0,0,0.7)",
        padding: "8px 16px",
        borderRadius: 1,
        backdropFilter: "blur(10px)",
      }}
    >
      <Typography variant="caption" sx={{ color: "#fff", opacity: 0.8 }}>
        Drag to rotate • Scroll to zoom
      </Typography>
    </Box>
  </Box>
);

export default dynamic(() => Promise.resolve(Car3DSection), { ssr: false });
