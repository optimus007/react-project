import "./App.css";
import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Instances,
  Instance,
  OrbitControls,
  Environment,
  useGLTF,
  Stats,
  PerformanceMonitor,
  usePerformanceMonitor,
} from "@react-three/drei";
import { useControls } from "leva";
import { Robot } from "./assets/Robot";
import { TweakBox } from "./assets/TweakBox";
import { Shoes } from "./assets/Shoes";

export default function App() {
  const [dpr, setDpr] = useState(0.5);

  return (
    <Canvas dpr={dpr} camera={{ position: [0, 10, 20], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.3} position={[5, 25, 20]} />

      <PerformanceMonitor
        iterations={3}
        onIncline={() => {
          setDpr(Math.min(dpr + 0.1, window.devicePixelRatio));

          console.log("Incline", dpr);
        }}
        onDecline={() => {
          setDpr(Math.max(dpr - 0.1, 0.5));
          console.log("Decline", dpr);
        }}
      />
      <TweakBox />
      <Suspense fallback={null}>
        <Shoes />
        <Environment preset="city" />
        <Robot scale={3} position={[0, 0, 4]} />
      </Suspense>
      <OrbitControls target={[0, 5, 0]} />
    </Canvas>
  );
}
