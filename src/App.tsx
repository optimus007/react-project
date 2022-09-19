import "./App.css";
import { Canvas, useFrame, ThreeElements, useLoader } from "@react-three/fiber";
import { useRef, useState, Suspense, useEffect } from "react";
import { Environment, OrbitControls, PerformanceMonitor, Stats, useGLTF, useAnimations, ContactShadows } from "@react-three/drei";
import { useControls } from "leva";
import { version } from "../package.json";
import round from "lodash/round";

function GuiStuff() {
  const ver = useControls({
    version: String(version),
  });
}

function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (mesh.current.rotation.x += 0.005));
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[0.1, 0.2, 0.1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} metalness={hovered ? 0 : 1} roughness={0} />
    </mesh>
  );
}

const Model = () => {
  const gltf = useGLTF("./model.glb");
  const { actions, names, mixer } = useAnimations(gltf.animations, gltf.scene);

  useEffect(() => {
    console.log("play");
    actions[names[0]]?.play();
  }, []);

  return (
    <>
      <primitive object={gltf.scene} scale={1} />
    </>
  );
};

function ThreeScene() {
  const [dpr, setDpr] = useState(1);

  const conShadow = useControls("shadow", {
    opacity: 0.5,
    blur: 0.5,
  });

  const groundProj = useControls("Ground", {
    height: 5,
    radius: 40,
    scale: 20,
  });

  return (
    <Canvas dpr={dpr} style={{ background: "grey" }} camera={{ position: [0, 2, 5] }}>
      <Stats />
      <PerformanceMonitor
        // onIncline={() => {
        //   setDpr(2)
        //   console.log("Incline")
        // }}
        // onDecline={() => {
        //   setDpr(1)
        //   console.log("Decline")
        // }}
        onChange={({ factor }) => {
          setDpr(round(0.5 + 1.5 * factor, 1));
          console.log({ factor, dpr });
        }}
      />
      <OrbitControls target={[0, 1, 0]} />

      <directionalLight color="green" position={[0, 0, 5]} intensity={3} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />

      <Suspense>
        <Environment
          files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/garden_nook_1k.hdr"
          ground={{
            height: groundProj.height,
            radius: groundProj.radius,
            scale: groundProj.scale,
          }}
        />
        <Model />
        <ContactShadows
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          opacity={conShadow.opacity}
          scale={5}
          blur={conShadow.blur}
          far={10}
          resolution={256}
        />
      </Suspense>
    </Canvas>
  );
}

function App() {
  GuiStuff();
  return (
    <>
      <ThreeScene />
    </>
  );
}

export default App;
