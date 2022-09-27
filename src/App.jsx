import "./App.css"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerformanceMonitor, MeshReflectorMaterial } from "@react-three/drei"
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

  return (
    <Canvas dpr={dpr} camera={{ position: [0, 2, 5], fov: 80 }}>
      <PerformanceMonitor
        iterations={3}
        onIncline={() => {
          setDpr(Math.min(dpr + 0.1, window.devicePixelRatio))

          console.log("Incline", dpr)
        }}
        onDecline={() => {
          setDpr(Math.max(dpr - 0.1, 0.5))
          console.log("Decline", dpr)
        }}
      />
      {/* <BoxesSpread /> */}
      {/* <TweakBox /> */}

      <Water />
      <Suspense fallback={null}>
        {/* <Shoes /> */}
        <Environment
          files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/clarens_midday_1k.hdr"
          ground={{
            height: groundProj.height,
            radius: groundProj.radius,
            scale: groundProj.scale,
          }}
        />
        {/* <Robot /> */}
        <Lanterns />
      </Suspense>

      <gridHelper />

      <OrbitControls target={[0, 1, 0]} />
    </Canvas>
  )
}
