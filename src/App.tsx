import "./App.css"
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber"
import { useRef, useState } from "react"
import { Environment, OrbitControls } from "@react-three/drei"
import { Pane } from "tweakpane"
import { name, version } from "../package.json"

const pane = new Pane({ title: String(version) })

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
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial
        color={hovered ? "hotpink" : "orange"}
        metalness={1}
        roughness={0}
      />
    </mesh>
  )
}

function ThreeScene() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/peppermint_powerplant_2_1k.hdr" />
    </Canvas>
  )
}

function App() {
  return <ThreeScene />
}

export default App
