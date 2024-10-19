// FaceMesh.tsx
import React, { useMemo, useEffect, useRef } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint16BufferAttribute,
  MeshBasicMaterial,
  DoubleSide,
} from "three";
import { faces, uvs } from "../../utils/constants"; // Pastikan data faces dan uvs valid

interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface FaceMeshProps {
  planeSize: [number, number];
  landmarks: Landmark[];
  hexColor: string; // Tambahkan prop hexColor
}

const FaceMesh: React.FC<FaceMeshProps> = ({
  planeSize,
  landmarks,
  hexColor,
}) => {
  const geometryRef = useRef<BufferGeometry | null>(null);
  const materialRef = useRef<MeshBasicMaterial | null>(null);

  // Inisialisasi geometry
  const geometry = useMemo(() => {
    const geom = new BufferGeometry();

    // Atur posisi awal menggunakan UVs
    const vertices = uvs.flatMap(([u, v]) => {
      const x = (u - 0.5) * planeSize[0];
      const y = -(v - 0.5) * planeSize[1]; // Invert Y-axis
      const z = 0;
      return [x, y, z];
    });

    geom.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    geom.setAttribute("uv", new Float32BufferAttribute(uvs.flat(), 2));
    geom.setIndex(new Uint16BufferAttribute(faces, 1));
    geom.computeVertexNormals();

    return geom;
  }, [planeSize]);

  // Inisialisasi material dengan warna dari hexColor
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: hexColor, // Gunakan hexColor dari props
        wireframe: false,
        side: DoubleSide,
        transparent: true,
        opacity: 0.15,
      }),
    [hexColor], // Tambahkan hexColor sebagai dependency
  );

  // Update warna material saat hexColor berubah
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(hexColor);
    }
  }, [hexColor]);

  // Update posisi vertex berdasarkan landmarks
  useEffect(() => {
    if (
      geometryRef.current &&
      geometryRef.current.attributes.position &&
      landmarks.length > 0
    ) {
      const position = geometryRef.current.attributes
        .position as Float32BufferAttribute;

      const outputWidth = planeSize[0];
      const outputHeight = planeSize[1];
      const minCount = Math.min(landmarks.length, position.count);

      for (let i = 0; i < minCount; i++) {
        const landmark = landmarks[i];

        // Skala koordinat sesuai ukuran plane
        const x = (landmark.x - 0.5) * outputWidth;
        const y = -(landmark.y - 0.5) * outputHeight;
        const z = 0;

        // Update posisi vertex
        position.setXYZ(i, x, y, z);
      }

      position.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
  }, [landmarks, planeSize]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      ref={(mesh) => {
        if (mesh) {
          geometryRef.current = mesh.geometry;
          materialRef.current = mesh.material as MeshBasicMaterial;
        }
      }}
    />
  );
};

export default FaceMesh;
