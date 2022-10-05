import "./App.css"
import { Canvas } from "@react-three/fiber"
import { Environment, MeshReflectorMaterial, OrbitControls } from "@react-three/drei"

import { DataTexture, LinearFilter, RepeatWrapping, RGBAFormat, UnsignedByteType } from "three"
import { useEffect, useRef } from "react"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"
import { useControls } from "leva"

const perlin = new ImprovedNoise()
const simplex = new SimplexNoise()

const generatePerlinTexture = (dim = 128, scale = 0.99) => {
  const data = new Uint8Array(dim * dim * 4)

  let i = 0
  for (let x = 0; x < dim; x++) {
    for (let y = 0; y < dim; y++) {
      const col = perlin.noise(x * scale, y * scale, 0) * 255
      data[i] = col
      data[i + 1] = col
      data[i + 2] = col
      data[i + 4] = 255
      i += 4
    }
  }

  const tex = new DataTexture(data, dim, dim)
  tex.format = RGBAFormat
  tex.type = UnsignedByteType
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.needsUpdate = true
  return tex
}

const generateSimplexTexture = (dim = 128, scale = 0.99) => {
  const data = new Uint8Array(dim * dim * 4)

  let i = 0
  for (let x = 0; x < dim; x++) {
    for (let y = 0; y < dim; y++) {
      const col = simplex.noise(x * scale, y * scale) * 255
      data[i] = col
      data[i + 1] = col
      data[i + 2] = col
      data[i + 4] = 255
      i += 4
    }
  }

  const tex = new DataTexture(data, dim, dim)
  tex.format = RGBAFormat
  tex.type = UnsignedByteType
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.needsUpdate = true
  return tex
}

function ReflectorMesh() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[5, 5]} />
      <MeshReflectorMaterial resolution={1024} mixStrength={40} roughness={1} color="#050505" metalness={0.5} />
    </mesh>
  )
}

export default function AppTextureGenerator() {
  const perlinMesh = useRef()
  const simplexMesh = useRef()
  const [{ dim, scale }, setDim] = useControls("DIM", () => ({
    dim: {
      value: 64,
      min: 8,
      max: 1024,
      step: 64,
    },
    scale: {
      value: 0.1,
      min: 0.0000001,
      max: 0.2,
    },
  }))

  let perlinTex = generatePerlinTexture(dim, scale)
  let simplexTex = generateSimplexTexture(dim, scale)

  useEffect(() => {
    console.log("dim changed", dim)

    if (perlinMesh.current && simplexMesh.current) {
      perlinTex = generatePerlinTexture(dim, scale)
      if (perlinMesh.current.material.map) perlinMesh.current.material.map.dispose()
      perlinMesh.current.material.map = perlinTex

      simplexTex = generateSimplexTexture(dim, scale)
      if (simplexMesh.current.material.map) simplexMesh.current.material.map.dispose()
      simplexMesh.current.material.map = simplexTex
    }
  }, [dim])

  return (
    <Canvas>
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/clarens_midday_2k.hdr" background />
      <mesh ref={perlinMesh} position={[-1, 0.5, 0]}>
        <boxGeometry />
        <meshStandardMaterial color={0xffffff} map={perlinTex} />
      </mesh>

      <mesh ref={simplexMesh} position={[1, 0.5, 0]}>
        <boxGeometry />
        <meshStandardMaterial color={0xffffff} map={simplexTex} />
      </mesh>
      <OrbitControls />
      <ReflectorMesh />
    </Canvas>
  )
}
