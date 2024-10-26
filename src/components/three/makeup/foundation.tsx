import { MeshProps } from "@react-three/fiber";
import React, { useMemo } from "react";
import { MeshBasicMaterial } from "three";
import { useSkinColor } from "../../skin-tone-finder-scene/skin-color-context";
import FaceMesh from "../face-mesh";
import { Landmark } from "../../../types/landmark";

interface FoundationProps extends MeshProps {
  landmarks: Landmark[];
  planeSize: [number, number];
}

const Foundation: React.FC<FoundationProps> = ({ landmarks, planeSize }) => {
  const { hexColor } = useSkinColor(); // Warna dari context

  // Inisialisasi material dengan useMemo
  const foundationMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: hexColor,
        transparent: true,
        opacity: 0.15,
      }),
    [hexColor], // Material diperbarui jika hexColor berubah
  );

  return (
    <FaceMesh
      landmarks={landmarks}
      material={foundationMaterial}
      planeSize={[planeSize[0], planeSize[1]]}
    />
  );
};

export default Foundation;
