import "./App.css"
import { Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, MeshReflectorMaterial, useTexture, Stars, Sparkles } from "@react-three/drei"
import { SkyLantern } from "./assets/SkyLanterns"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import { useControls } from "leva"
import { Water } from "./assets/Water"
import { RepeatWrapping } from "three"

const Extra = () => {
  const whiteTex = useTexture("./white.jpg", (texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(60, 60)
    texture.needsUpdate = true
  })

  const tex = useTexture("./water_norm.jpg", (texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping
  })

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    whiteTex.offset.set(t * 0.03, Math.sin(t * 0.01))
  })

  return (
    <group name="EXTRA in appEmpty">
      <Suspense>
        <SkyLantern />
        <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[25, 64]} />
          <MeshReflectorMaterial
            blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
            mixBlur={0} // How much blur mixes with surface roughness (default = 1)
            mixStrength={10} // Strength of the reflections
            mixContrast={1} // Contrast of the reflections
            resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
            mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
            depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
            minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
            maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
            depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
            distortion={0.05} // Amount of distortion based on the distortionMap texture
            debug={0}
            reflectorOffset={0.0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
            roughness={1}
            color={"grey"}
            distortionMap={tex}
            map={whiteTex}
            normalMap={tex}
          />
        </mesh>
      </Suspense>
      <Stars speed={1} />
      <Sparkles scale={10} />
    </group>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 2, 2], fov: 80 }}>
      <Suspense fallback={null}>
        <Environment preset="night" background ground />
        <Extra />
      </Suspense>
      <gridHelper />
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.1} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.35} intensity={0.5} mipmapBlur radius={0.67} />
        <DepthOfField bokehScale={5} height={500} focalLength={0.01} target={[0, 0, 0]} />
      </EffectComposer>
    </Canvas>
  )
}
