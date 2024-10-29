// FaceMesh.tsx
import React, { useMemo, useEffect, useRef } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint16BufferAttribute,
  Material,
  DoubleSide,
} from "three";
import { useFrame } from "@react-three/fiber"; // Import useFrame
import { faces, uvs, positions } from "../../utils/constants"; // Pastikan data faces dan uvs valid
import { Landmark } from "../../types/landmark";

interface FaceMeshProps {
  planeSize: [number, number];
  landmarks: React.RefObject<Landmark[]>;
  material: Material;
}

const FaceMesh: React.FC<FaceMeshProps> = ({
  planeSize,
  landmarks,
  material,
}) => {
  const geometryRef = useRef<BufferGeometry | null>(null);

  // Initialize geometry with inverted face indices
  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    const vertices = new Float32Array(positions.length * 3);
    const uvArray = new Float32Array(uvs.length * 2);

    for (let i = 0; i < positions.length; i++) {
      vertices[i * 3] = positions[i][0];
      vertices[i * 3 + 1] = positions[i][1];
      vertices[i * 3 + 2] = positions[i][2];
    }

    for (let i = 0; i < uvs.length; i++) {
      uvArray[i * 2] = uvs[i][0];
      uvArray[i * 2 + 1] = uvs[i][1];
    }

    // Set attributes
    geom.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    geom.setAttribute("uv", new Float32BufferAttribute(uvArray, 2));

    // Invert face indices to flip the mesh
    const invertedFaces: number[] = [];
    for (let i = 0; i < faces.length; i += 3) {
      // Membalik urutan indeks untuk setiap segitiga
      invertedFaces.push(faces[i], faces[i + 2], faces[i + 1]);
    }
    geom.setIndex(new Uint16BufferAttribute(invertedFaces, 1));

    // Compute normals after inverting indices
    geom.computeVertexNormals();

    return geom;
  }, [planeSize]);

  // Assign geometry to mesh
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        "position",
        geometry.getAttribute("position"),
      );
      geometryRef.current.setAttribute("uv", geometry.getAttribute("uv"));
      geometryRef.current.setIndex(geometry.getIndex());
      geometryRef.current.computeVertexNormals(); // Recompute normals
    }
  }, [geometry]);

  // Update vertex positions based on landmarks using useFrame
  useFrame(() => {
    if (
      geometryRef.current &&
      geometryRef.current.attributes.position &&
      landmarks.current &&
      landmarks.current.length > 0
    ) {
      const position = geometryRef.current.attributes
        .position as Float32BufferAttribute;

      const outputWidth = planeSize[0];
      const outputHeight = planeSize[1];

      const minCount = Math.min(landmarks.current.length, position.count);

      for (let i = 0; i < minCount; i++) {
        const landmark = landmarks.current[i];

        // Skala koordinat sesuai ukuran plane tanpa membalikkan x
        const x = -(landmark.x - 0.5) * outputWidth;
        const y = -(landmark.y - 0.5) * outputHeight;
        const z = -landmark.z;

        // Update posisi vertex
        position.setXYZ(i, x, y, z);
      }

      position.needsUpdate = true;
      geometryRef.current.computeVertexNormals(); // Recompute normals setelah update
    }
  });

  return (
    <mesh
      geometry={geometry}
      material={material} // Pastikan material diatur ke FrontSide (default)
      ref={(mesh) => {
        if (mesh) {
          geometryRef.current = mesh.geometry;
        }
      }}
    />
  );
};

export default FaceMesh;
