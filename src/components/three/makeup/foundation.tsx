import { MeshProps } from "@react-three/fiber";
import React, { useMemo, Suspense } from "react";
import { Color, MeshBasicMaterial } from "three";
import FaceMesh from "../face-mesh";
import { Landmark } from "../../../types/landmark";
import { useMakeup } from "../makeup-context";

interface FoundationProps extends MeshProps {
  landmarks: Landmark[];
  planeSize: [number, number];
}

const FoundationInner: React.FC<FoundationProps> = React.memo(
  ({ landmarks, planeSize }) => {
    const { foundationColor } = useMakeup();

    // Membuat material dengan useMemo hanya saat foundationColor berubah
    const foundationMaterial = useMemo(() => {
      return new MeshBasicMaterial({
        color: new Color(foundationColor),
        transparent: true,
        opacity: 0.15,
      });
    }, [foundationColor]);

    return (
      <FaceMesh
        landmarks={landmarks}
        material={foundationMaterial}
        planeSize={planeSize}
      />
    );
  },
);

const Foundation: React.FC<FoundationProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <FoundationInner {...props} />
    </Suspense>
  );
};

export default Foundation;
