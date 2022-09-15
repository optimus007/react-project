import "./App.css"
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber"
import { useRef, useState } from "react"

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
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  )
}

function ThreeScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}

function App() {
  return <ThreeScene />
}

export default App
