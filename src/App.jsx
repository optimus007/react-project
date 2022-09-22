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

const color = new THREE.Color();
const randomVector = (r) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r + r / 2, r / 2 - Math.random() * r];
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
const randomData = Array.from({ length: 1000 }, (r = 10) => ({
  random: Math.random(),
  position: randomVector(r),
  rotation: randomEuler(),
}));

function Shoes() {
  const { range } = useControls({ range: { value: 100, min: 0, max: 1000, step: 10 } });

  const { nodes, materials } = useGLTF("/shoe.glb");
  return (
    <Instances range={range} material={materials.phong1SG} geometry={nodes.Shoe.geometry}>
      {randomData.map((props, i) => (
        <Shoe key={i} {...props} />
      ))}
    </Instances>
  );
}

function Shoe({ random, ...props }) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000;
    ref.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2);
    ref.current.position.y = Math.sin(t / 1.5) / 2;
  });
  return (
    <group {...props}>
      <Instance ref={ref} />
    </group>
  );
}

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
