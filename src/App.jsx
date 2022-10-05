import "./App.css"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerformanceMonitor, MeshReflectorMaterial, CameraShake, PresentationControls } from "@react-three/drei"
import { useControls } from "leva"
import { Robot } from "./assets/Robot"
import { TweakBox } from "./assets/TweakBox"
import { Shoes } from "./assets/Shoes"
import { BoxesSpread } from "./assets/BoxesSpread"
import { Lanterns } from "./assets/Lantern"
import Grass from "./assets/Grass"
import { Water } from "./assets/Water"

export default function App() {
  const [{ dpr }, setDpr] = useControls(
    "Px Ratio",
    () => ({
      dpr: {
        value: 1,
        min: 0.4,
        max: window.devicePixelRatio,
        step: 0.2,
      },
    }),
    { collapsed: true }
  )

  const groundProj = useControls(
    "Ground",
    {
      height: 15,
      radius: 50,
      scale: 800,
    },
    { collapsed: true }
  )

  const config = {
    maxYaw: 0.1, // Max amount camera can yaw in either direction
    maxPitch: 0.1, // Max amount camera can pitch in either direction
    maxRoll: 0.1, // Max amount camera can roll in either direction
    yawFrequency: 0.1, // Frequency of the the yaw rotation
    pitchFrequency: 0.1, // Frequency of the pitch rotation
    rollFrequency: 0.1, // Frequency of the roll rotation
    intensity: 1, // initial intensity of the shake
    decay: false, // should the intensity decay over time
    decayRate: 0.65, // if decay = true this is the rate at which intensity will reduce at
    controls: undefined, // if using orbit controls, pass a ref here so we can update the rotation
  }

  return (
    <Canvas dpr={dpr} camera={{ position: [0, 2, 5], fov: 80 }}>
      <PerformanceMonitor
        iterations={3}
        onIncline={() => {
          setDpr(Math.min(dpr + 0.1, Math.min(2, window.devicePixelRatio)))
        }}
        onDecline={() => {
          setDpr(Math.max(dpr - 0.1, 0.5))
        }}
      />
      {/* <BoxesSpread /> */}
      {/* <TweakBox /> */}
      <Water />
      <Suspense fallback={null}>
        {/* <Shoes /> */}
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/clarens_midday_2k.hdr" background />
        {/* <Robot /> */}
        <Lanterns />
      </Suspense>
      <gridHelper />
      <OrbitControls makeDefault />
      <CameraShake
        maxYaw={0.1} // Max amount camera can yaw in either direction
        maxPitch={0.1} // Max amount camera can pitch in either direction
        maxRoll={0.1} // Max amount camera can roll in either direction
        yawFrequency={0.1} // Frequency of the the yaw rotation
        pitchFrequency={0.1} // Frequency of the pitch rotation
        rollFrequency={0.1} // Frequency of the roll rotation
        intensity={1} // initial intensity of the shake
        decayRate={0.65} // if decay = true this is the rate at which intensity will reduce at />
      />
    </Canvas>
  )
}
