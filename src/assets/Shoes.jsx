import { Instance, Instances, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect } from "react";
import { useRef, useState } from "react";

const randomVector = (r) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r + r / 2, r / 2 - Math.random() * r];
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];

export function Shoes() {
  const { range, spread } = useControls("Shoes", {
    range: { value: 100, min: 0, max: 1000, step: 10 },
    spread: { value: 5, min: 0, max: 20, step: 0.01 },
  });

  let randomData = Array.from({ length: 1000 }, (r = spread) => ({
    random: Math.random(),
    position: randomVector(r),
    rotation: randomEuler(),
  }));

  const { nodes, materials } = useGLTF("./shoe.glb");
  return (
    <Instances range={range} material={materials.phong1SG} geometry={nodes.Shoe.geometry} scale={0.3}>
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
    // ref.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2);
    ref.current.position.y = Math.sin(t / 1.5) / 2;
  });
  return (
    <group {...props}>
      <Instance ref={ref} />
    </group>
  );
}
