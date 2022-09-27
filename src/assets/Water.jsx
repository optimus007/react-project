import { MeshReflectorMaterial, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { folder, useControls } from "leva"
import { useEffect } from "react"
import { RepeatWrapping } from "three"

export function Water() {
  const texture = useTexture("./water_norm.jpg", (texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping
  })

  const [{ color, res, blurX, blurY, rou, met, mixStrength, mixBlur, minDepthThreshold, depthScale, repeat, distortion }] = useControls(
    "Water",
    () => ({
      material: folder({
        color: "#111414",
        rou: {
          value: 1,
          min: 0,
          max: 1,
        },
        met: {
          value: 0.5,
          min: 0,
          max: 1,
        },
      }),
      res: {
        value: 1024,
        min: 256,
        max: 2048,
        step: 128,
      },

      blurX: {
        value: 400,
        min: 0,
        max: 2048,
        step: 1,
      },
      blurY: {
        value: 100,
        min: 0,
        max: 2048,
        step: 1,
      },

      mixStrength: {
        value: 15,
        min: 0,
        max: 30,
        step: 0.1,
      },

      mixBlur: {
        value: 1,
        min: 0,
        max: 3,
        step: 0.1,
      },

      minDepthThreshold: {
        value: 0.4,
        min: 0,
        max: 1,
        step: 0.1,
      },

      depthScale: {
        value: 1,
        min: 0,
        max: 30,
        step: 0.1,
      },

      repeat: {
        value: 30,
        min: 1,
        max: 30,
        step: 1,
      },

      distortion: {
        value: 0.1,
        min: 0,
        max: 3,
        step: 0.01,
      },
    }),
    { collapsed: true }
  )

  useEffect(() => {
    texture.repeat.set(repeat, repeat)
    texture.needsUpdate = true
  }, [repeat])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    texture.offset.set(t * 0.03, Math.sin(t * 0.01))
  })

  return (
    <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[25, 64]} />
      <MeshReflectorMaterial
        blur={[blurX, blurY]}
        resolution={res}
        mixBlur={mixBlur}
        mixStrength={mixStrength}
        depthScale={depthScale}
        minDepthThreshold={minDepthThreshold}
        color={color}
        metalness={met}
        roughness={rou}
        normalMap={texture}
        distortion={distortion}
        distortionMap={texture}
      />
    </mesh>
  )
}
