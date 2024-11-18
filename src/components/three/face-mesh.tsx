import React, { useMemo, useEffect, useRef } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint16BufferAttribute,
  Material,
  Mesh,
} from "three";
import { useFrame } from "@react-three/fiber";
import { faces, uvs, positions } from "../../utils/constants";
import { Landmark } from "../../types/landmark";

interface FaceMeshProps {
  planeSize: [number, number];
  landmarks: React.RefObject<Landmark[]>;
  material: Material;
  flipHorizontal?: boolean;
}

const FaceMesh: React.FC<FaceMeshProps> = ({
  planeSize,
  landmarks,
  material,
  flipHorizontal = false,
}) => {
  const geometryRef = useRef<BufferGeometry | null>(null);
  const meshRef = useRef<Mesh>(null); // Ref for the mesh

  // Initialize geometry without modifying face indices
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

    geom.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    geom.setAttribute("uv", new Float32BufferAttribute(uvArray, 2));
    geom.setIndex(new Uint16BufferAttribute(faces, 1));
    geom.computeVertexNormals();

    return geom;
  }, [planeSize]);

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        "position",
        geometry.getAttribute("position"),
      );
      geometryRef.current.setAttribute("uv", geometry.getAttribute("uv"));
      geometryRef.current.setIndex(geometry.getIndex());
      geometryRef.current.computeVertexNormals();
    }
  }, [geometry]);

  // Update vertex positions based on landmarks
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
        const x = (landmark.x - 0.5) * outputWidth;
        const y = -(landmark.y - 0.5) * outputHeight;
        const z = -landmark.z;
        position.setXYZ(i, x, y, z);
      }

      position.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }

    // Flip mesh horizontally by setting scale.x to -1 if flipHorizontal is true
    if (meshRef.current) {
      meshRef.current.scale.set(flipHorizontal ? -1 : 1, 1, 1);
    }
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      ref={(mesh) => {
        if (mesh) {
          geometryRef.current = mesh.geometry;
          meshRef.current = mesh; // Store reference to mesh for scale adjustment
        }
      }}
    />
  );
};

export default FaceMesh;
