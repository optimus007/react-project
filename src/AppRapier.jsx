import "./App.css"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, AdaptiveDpr, Environment } from "@react-three/drei"
import { RigidBody, Physics, Debug } from "@react-three/rapier"
import { useControls } from "leva"
import { MathUtils } from "three"

export default function AppRapier() {
  const { debug } = useControls({ debug: false })

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 80 }}>
      <Environment preset="studio" background />
      <AdaptiveDpr pixelated />
      <Physics colliders={false}>
        {debug && <Debug />}
        <group position={[0, 0, 0]}>
          <Spheres />
          <Floor />
        </group>
      </Physics>

      <OrbitControls makeDefault />
    </Canvas>
  )
}

const Spheres = () => {
  const { count } = useControls({ count: { value: 10, min: 0, max: 100, step: 1 } })

  let spheres = []
  for (let index = 0; index < count; index++) {
    spheres[index] = <Sphere key={index} position={[MathUtils.randFloatSpread(0.5), index + 1, MathUtils.randFloatSpread(0.5)]}></Sphere>
  }

  return spheres
}

const Sphere = (props) => (
  <RigidBody colliders="ball" restitution={0.7}>
    <mesh castShadow receiveShadow {...props}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="white" roughness={0.1} metalness={1} />
    </mesh>
  </RigidBody>
)

const Floor = () => (
  <RigidBody colliders="trimesh" type="fixed">
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5, 5]} />

      <meshStandardMaterial color={"red"} roughness={0.3} />
    </mesh>
  </RigidBody>
)
