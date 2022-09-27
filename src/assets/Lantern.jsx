import { Instance, Instances, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useEffect, useRef, extend, useMemo, useState } from "react"
import { Color, DoubleSide, MathUtils, Object3D } from "three"

function Box({ id, object, temp = new Object3D(), ...props }) {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return

    ref.current.position.copy(object.position)
    // ref.current.scale.set(10.0, 10.0, 10.0);
  }, [object])

  return (
    <group {...props}>
      <Instance ref={ref} />
    </group>
  )
}

function Boxes({ count = 10, objects, temp = new Object3D() }) {
  return (
    <group>
      <Instances range={count}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
        {objects.map((obj, i) => (
          <Box key={i} id={i} object={obj} />
        ))}
      </Instances>
    </group>
  )
}

function Lantern() {
  const lan = useRef()
  const gltf = useGLTF("./sky_lantern.glb")
  useEffect(() => {
    console.log(lan)
  }, [lan])

  useFrame(
    (state) => {
      const t = state.clock.getElapsedTime()
      lan.current.position.y = Math.sin(t / 1.5) / 2 + 0.5
    },
    [lan]
  )

  return (
    <group>
      <primitive object={gltf.scene} ref={lan} />
    </group>
  )
}

export function Lanterns() {
  const { range } = useControls(
    "Lanterns",
    {
      range: { value: 100, min: 0, max: particles.length, step: 1 },
    },
    { collapsed: true }
  )

  const lan = useRef()
  const { scene, materials, nodes } = useGLTF("./sky_lantern.glb")

  const ref = useRef()

  useEffect(() => {
    console.log({ scene, materials, nodes })
    materials.lantern.side = DoubleSide
  }, [])

  // useFrame(
  //   (state, delta) => void (ref.current.rotation.y = MathUtils.damp(ref.current.rotation.y, (-state.mouse.x * Math.PI) / 6, 2.75, delta))
  // );

  return (
    <Instances
      limit={particles.length}
      range={range}
      ref={ref}
      position={[0, 0, 0]}
      geometry={nodes.Low.geometry}
      material={materials.lantern}
    >
      {/* <sphereGeometry args={[0.5, 32, 32]} /> */}

      <meshStandardMaterial roughness={0} color="#f0f0f0" />
      {particles.map((data, i) => (
        <Bubble key={i} {...data} />
      ))}
    </Instances>
  )
}

const particles = Array.from({ length: 1000 }, () => ({
  factor: MathUtils.randInt(1, 20),
  rotFactor: MathUtils.randFloat(0.01, 0.1),
  speed: MathUtils.randFloat(0.01, 1),
  xFactor: MathUtils.randFloatSpread(10),
  yFactor: MathUtils.randFloatSpread(10) + 5,
  zFactor: MathUtils.randFloatSpread(10),
}))

console.log({ particles })
const color = new Color()
function Bubble({ factor, speed, xFactor, yFactor, zFactor, rotFactor }) {
  const ref = useRef()

  useFrame((state) => {
    const t = factor + state.clock.elapsedTime * (speed / 2)
    // ref.current.scale.setScalar(Math.max(1, Math.cos(t) * 5))
    // ref.current.rotation.set(
    //   0.01 * Math.cos(t) + Math.sin(t * 1) / 10 + Math.cos((t / 10) * rotFactor) + (Math.sin(t * 1) * rotFactor) / 10,
    //   0.01 * Math.sin(t) + Math.cos(t * 2) / 10 + Math.sin((t / 10) * rotFactor) + (Math.cos(t * 2) * rotFactor) / 10,
    //   0.01 * Math.sin(t) + Math.cos(t * 2) / 10 + Math.cos((t / 10) * rotFactor) + (Math.sin(t * 3) * rotFactor) / 10
    // );
    ref.current.position.set(
      Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
      Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
      Math.sin(t) + Math.cos(t * 2) / 10 + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
    )
    if (ref.current.position.y < 0) {
      ref.current.position.y = 0
    }
  })
  return <Instance ref={ref} color={"#" + color.setHSL(Math.random(), 0.5, 0.5).convertLinearToSRGB().getHexString()} />
}
