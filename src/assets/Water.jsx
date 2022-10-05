import { MeshReflectorMaterial, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { folder, useControls } from "leva"
import { useEffect, useState } from "react"
import { DataTexture, LinearFilter, MathUtils, MeshStandardMaterial, RepeatWrapping, RGBAFormat, UnsignedByteType } from "three"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"

const perlin = new ImprovedNoise()
const simplex = new SimplexNoise()

const generateTexture = (w = 128, h = 128) => {
  const data = new Uint8Array(w * h * 4)

  const dim = 128
  // for (let x = 0; x < w; x++) {
  //   for (let y = 0; y < h; y++) {
  //     data[x + y] = 255
  //   }
  // }
  for (let index = 0; index < data.length; index += 4) {
    data[index] = simplex.noise(index / 200, 0)
    data[index + 1] = 255
    data[index + 2] = 0
    // data[index] = 255
  }
  const tex = new DataTexture(data, w, h)
  tex.format = RGBAFormat
  tex.type = UnsignedByteType
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.needsUpdate = true

  return tex
}

export function Water() {
  const texture = useTexture("./water_norm.jpg", (texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.format = RGBAFormat
  })

  const textureCol = useTexture("./water_col.jpg", (texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.format = RGBAFormat
  })

  const genTexture = generateTexture()

  console.log(genTexture.image)

  const [{ color, blurX, blurY, rou, met, mixStrength, mixBlur, minDepthThreshold, depthScale, repeat, distortion }] = useControls(
    "Water",
    () => ({
      material: folder({
        color: "#ffffff", //"#141313",
        rou: {
          value: 0.4,
          min: 0,
          max: 1,
        },
        met: {
          value: 1,
          min: 0,
          max: 1,
        },
      }),

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
        value: 30,
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
        value: 60,
        min: 1,
        max: 120,
        step: 1,
      },

      distortion: {
        value: 1,
        min: 0,
        max: 3,
        step: 0.01,
      },
    }),
    { collapsed: true }
  )

  const [normalScale, setNormalScale] = useState(1)

  useEffect(() => {
    textureCol.repeat.set(repeat, repeat)
    texture.repeat.set(repeat, repeat)
  }, [repeat])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    texture.offset.set(t * 0.03, Math.sin(t * 0.01))
    textureCol.offset.set(t * 0.03, Math.sin(t * 0.01))
  })

  return (
    <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[25, 64]} />
      <MeshReflectorMaterial
        resolution={1024}
        // mixBlur={mixBlur}
        mixStrength={mixStrength}
        depthScale={depthScale}
        minDepthThreshold={minDepthThreshold}
        color={color}
        map={genTexture}
        metalness={met}
        roughness={rou}
        // normalMap={texture}
        // normalScale={[normalScale, normalScale]}
        // distortion={distortion}
        // distortionMap={genTexture}
      />

      {/* <meshStandardMaterial color={color} map={genTexture} metalness={met} roughness={rou} /> */}
    </mesh>
  )
}
