import "./App.css";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function App() {
  console.log("App called");
  return (
    <Canvas>
      <OrbitControls />
      <mesh>
        <boxBufferGeometry />
        <meshPhongMaterial />
      </mesh>
      <ambientLight args={[0xff0000]} intensity={0.1} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
    </Canvas>
  );
}

export default App;
