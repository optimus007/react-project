import { Box } from "@react-three/drei"
import { useControls, folder, button } from "leva"

export function TweakBox() {
  const [{ scale, color, wireframe, position }, set] = useControls(
    "Box",
    () => ({
      transform: folder({
        scale: {
          value: 1,
          min: 0.4,
          max: 4,
          step: 0.2,
        },
        position: [0, 8, 7],
      }),
      material: folder({
        color: "#333",
        wireframe: false,
      }),
      reset: button(() => {
        set({
          scale: 1,
          position: [0, 8, 7],
          color: "#333",
          wireframe: false,
        })
      }),
    }),
    { collapsed: true }
  )

  return (
    <Box scale={scale} position={position}>
      <meshStandardMaterial color={color} wireframe={wireframe} />
    </Box>
  )
}
