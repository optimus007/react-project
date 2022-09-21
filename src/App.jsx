import "./App.css";
import { Canvas, useFrame, ThreeElements, useLoader } from "@react-three/fiber";
import { useRef, useState, Suspense, useEffect } from "react";
import { Environment, OrbitControls, PerformanceMonitor, Stats, useGLTF, useAnimations, ContactShadows, Instances, Instance } from "@react-three/drei";
import { useControls } from "leva";
import { version } from "../package.json";
import { Color, MathUtils } from "three";

function GuiStuff() {
  const ver = useControls({
    version: String(version),
  });
}
const params = {
  range: 0,
};

function Box(props) {
  const mesh = useRef();

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

const color = new Color();
const randomVector = (r) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r + r / 2, r / 2 - Math.random() * r];
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
const randomData = Array.from({ length: 1000 }, (r = 5) => ({ random: Math.random(), position: randomVector(r), rotation: randomEuler() }));

const Shoes = ({ range }) => {
  const gltf = useGLTF("./shoe.glb");
  const { nodes, materials } = gltf;

  return (
    <Instances range={range} material={materials.phong1SG} geometry={nodes.Shoe.geometry}>
      {randomData.map((props, i) => (
        <Shoe key={i} {...props} />
      ))}
    </Instances>
  );
};

function Shoe({ random, ...props }) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000;
    ref.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2);
    ref.current.position.y = Math.sin(t / 1.5) / 2;
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = MathUtils.lerp(ref.current.scale.z, hovered ? 1 : 0.5, 0.1);
    ref.current.color.lerp(color.set(hovered ? "red" : "white"), hovered ? 1 : 0.1);
  });
  return (
    <group {...props}>
      <Instance
        ref={ref}
        // onPointerOver={(e) => (e.stopPropagation(), setHover(true))} onPointerOut={(e) => setHover(false)}
      />
    </group>
  );
}

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

  // const canvasProps = useControls("Canvas", {
  //   dpr: dpr,
  // });
  const { range } = useControls({ range: { value: 10, min: 0, max: 500, step: 10 } });
  return (
    <Canvas dpr={dpr} style={{ background: "grey" }} camera={{ position: [0, 2, 5] }}>
      <Stats />
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

        <Shoes range={range} />
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
