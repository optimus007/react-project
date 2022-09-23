import { useEffect, useRef } from "react";
import { Color, Object3D, MathUtils } from "three";

export function BoxesSpread({ count = 1000, spreadArea = 10, temp = new Object3D() }) {
  const ref = useRef();
  const color = new Color(0xffffff);
  useEffect(() => {
    // Set positions
    for (let i = 0; i < count; i++) {
      temp.position.set(
        MathUtils.randFloat(-spreadArea, spreadArea),
        MathUtils.randFloat(0, spreadArea * 2),
        MathUtils.randFloat(-spreadArea, spreadArea)
      );

      temp.scale.setScalar(MathUtils.randFloat(0.5, 1.5));
      temp.rotation.set(Math.cos(i / 4) / 2, Math.sin(i / 4) / 2, Math.cos(i / 1.5) / 2);

      temp.updateMatrix();
      ref.current.setMatrixAt(i, temp.matrix);
      ref.current.setColorAt(i, color.setHSL(Math.random(), 0.5, 0.5));
    }

    // Update the instance
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
