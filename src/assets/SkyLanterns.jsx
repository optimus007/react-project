import { Instance, Instances, useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useEffect, useRef, extend, useMemo, useState } from "react"
import { Color, DoubleSide, MathUtils, Object3D, sRGBEncoding } from "three"

const black = new Color(0x000000)
const white = new Color(0xffffff)

export function SkyLantern() {
  const { fire } = useControls("Lantern", {
    fire: { value: 0, min: 0, max: 1, step: 0.01 },
  })

  const diff = useTexture("./lantern_diff.jpg")
  diff.flipY = false

  const emi = useTexture("./lantern_emi.jpg")
  emi.encoding = sRGBEncoding
  emi.flipY = false

  const nor = useTexture("./lantern_nor.jpg")
  nor.flipY = false

  const lan = useRef()
  const { nodes, materials } = useGLTF("./sky_lantern.glb")

  const lMesh = nodes.Low
  const lMat = materials.lantern

  useEffect(() => {
    console.log("SkyLantern  useEffect", { lan, nodes, materials })

    lMat.map = diff
    lMat.roughness = 0.1
    lMat.emissiveMap = emi
    lMat.normalMap = nor
  }, [])

  useEffect(() => {
    lMat.emissiveIntensity = fire
    lMat.color.lerpColors(white, black, fire)
    lMat.emissive.lerpColors(black, white, fire)
    console.log("fire", lMat.emissiveIntensity)
  }, [fire])

  useFrame(
    (state) => {
      const t = state.clock.getElapsedTime()

      lan.current.position.y = MathUtils.lerp(lan.current.position.y, (Math.sin(t / 1.5) + 1) * fire * 0.2, 0.01)

      lan.current.rotation.x = MathUtils.lerp(lan.current.rotation.x, MathUtils.mapLinear(Math.sin(t), -1, 1, 0.1, -0.1) * fire, 0.01)
      lan.current.rotation.z = MathUtils.lerp(lan.current.rotation.z, MathUtils.mapLinear(Math.sin(t), -1, 1, 0.1, -0.1) * fire, 0.01)
    },
    [lan]
  )

  return <primitive object={lMesh} ref={lan} />
}
