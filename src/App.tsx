import "./App.css"

import { Canvas, useFrame, ThreeElements, useLoader } from "@react-three/fiber"
import { useRef, useState, Suspense } from "react"
import {
  Environment,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei"
import { useControls } from "leva"
import { version } from "../package.json"
import round from "lodash/round"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

function MyComponent() {
  const folder = useControls(String(version).replaceAll(".", "_"), {
    showLighting: true,
    showStats: false,
  })
  console.log("leva", { folder })
}

function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (mesh.current.rotation.x += 0.005))
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
      <meshStandardMaterial
        color={hovered ? "hotpink" : "orange"}
        metalness={hovered ? 0 : 1}
        roughness={0}
      />
    </mesh>
  )
}

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./model.glb")
  return (
    <>
      <primitive object={gltf.scene} scale={0.4} />
    </>
  )
}

function ThreeScene() {
  const [dpr, setDpr] = useState(1)
  return (
    <Canvas dpr={dpr} style={{ background: "grey" }}>
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
          setDpr(round(0.5 + 1.5 * factor, 1))
          console.log({ factor, dpr })
        }}
      />
      <OrbitControls />

      <directionalLight color="green" position={[0, 0, 5]} intensity={3} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <gridHelper />
      <Suspense>
        <Model />
        <Environment
          files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/peppermint_powerplant_2_1k.hdr"
          background
        />
      </Suspense>
    </Canvas>
  )
}

function App() {
  MyComponent()
  return (
    <>
      <ThreeScene />
    </>
  )
}

export default App
