import { MeshProps, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useMemo, useRef, Suspense, useEffect } from "react";
import {
  Euler,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  TextureLoader,
  Vector3,
} from "three";
import { Landmark } from "../../../types/landmark";
import { useGLTF } from "@react-three/drei";
import { HEAD_OCCLUDER } from "../../../utils/constants";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// Function to calculate the distance between two landmarks
function calculateDistance(landmark1: Landmark, landmark2: Landmark) {
  const dx = landmark1.x - landmark2.x;
  const dy = landmark1.y - landmark2.y;
  const dz = landmark1.z - landmark2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

interface HeadOccludeProps extends MeshProps {
  landmarks: React.RefObject<Landmark[]>;
  planeSize: [number, number];
}

const HeadOccluderInner: React.FC<HeadOccludeProps> = React.memo(
  ({ landmarks, planeSize }) => {
    const occluderRef = useRef<Object3D | null>(null);
    const { scene, size, viewport } = useThree();

    const outputWidth = planeSize[0];
    const outputHeight = planeSize[1];

    useEffect(() => {
      const loader = new GLTFLoader();
      loader.load(
        HEAD_OCCLUDER,
        (gltf) => {
          const occluder = gltf.scene;
          occluder.traverse((child) => {
            if ((child as Mesh).isMesh) {
              const mesh = child as Mesh;
              mesh.material = new MeshBasicMaterial({
                // colorWrite: false,
                // depthWrite: true,
              });
              mesh.renderOrder = 1;
            }
          });

          occluderRef.current = occluder;
          scene.add(occluder);
          console.log("Occluder model loaded successfully");
        },
        undefined,
        (error) => {
          console.error(
            "An error occurred loading the occluder model: ",
            error,
          );
        },
      );

      return () => {
        if (occluderRef.current) {
          scene.remove(occluderRef.current);
        }
      };
    }, [scene]);

    useFrame(() => {
      if (!landmarks.current || !occluderRef.current) return;

      const centerHead = landmarks.current[1];

      // Scale coordinates proportionally with the viewport
      const scaleX = viewport.width / outputWidth;
      const scaleY = viewport.height / outputHeight;

      const centerHeadX =
        (1 - centerHead.x) * outputWidth * scaleX - viewport.width / 2;
      const centerHeadY =
        -centerHead.y * outputHeight * scaleY + viewport.height / 2;
      const centerHeadZ = -centerHead.z * 100;

      const faceSize = calculateDistance(
        landmarks.current[162],
        landmarks.current[389],
      );

      const scaleFactor = faceSize * Math.min(scaleX, scaleY) * 80;

      if (centerHead) {
        occluderRef.current.position.set(
          -centerHeadX,
          centerHeadY,
          centerHeadZ,
        );
        occluderRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }

      // Extract necessary landmarks
      const nose = landmarks.current[1];
      const chin = landmarks.current[152];
      const leftEye = landmarks.current[33];
      const rightEye = landmarks.current[263];
      const leftEar = landmarks.current[234];
      const rightEar = landmarks.current[454];

      // Calculate vectors for face orientation
      const eyeMid = new Vector3(
        (leftEye.x + rightEye.x) / 2,
        (leftEye.y + rightEye.y) / 2,
        (leftEye.z + rightEye.z) / 2,
      );
      const earMid = new Vector3(
        (leftEar.x + rightEar.x) / 2,
        (leftEar.y + rightEar.y) / 2,
        (leftEar.z + rightEar.z) / 2,
      );

      // Vektor forward dan up
      const forward = new Vector3().subVectors(nose, earMid).normalize();
      const up = new Vector3().subVectors(chin, eyeMid).normalize();

      // Vektor right
      const right = new Vector3().crossVectors(up, forward).normalize();

      // Buat matriks rotasi
      const rotationMatrix = new Matrix4();
      rotationMatrix.makeBasis(right, up, forward);

      const horizontal = new Vector3(forward.x, 0, forward.z).normalize();
      const pitchAngle = -Math.acos(forward.dot(horizontal)); // Sudut antara forward dan horizontal

      // Tentukan arah pitch (positif ke atas, negatif ke bawah)
      const pitchDirection = forward.y > 0 ? -1 : 1;
      const pitch = pitchAngle * pitchDirection;

      // Buat rotasi Euler dengan pitch, yaw, dan roll
      const deltaX = nose.x - earMid.x;
      const deltaZ = nose.z - earMid.z;
      const yaw = Math.atan2(deltaX, deltaZ);

      const deltaY = rightEye.y - leftEye.y;
      const deltaX_roll = rightEye.x - leftEye.x;
      const roll = Math.atan2(deltaY, deltaX_roll);

      const euler = new Euler(pitch, yaw, roll, "YXZ");

      // Konversi Euler ke kuaternion
      const finalQuaternion = new Quaternion().setFromEuler(euler);

      occluderRef.current.quaternion.copy(finalQuaternion);
    });

    return null;
  },
);

const HeadOccluder: React.FC<HeadOccludeProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <HeadOccluderInner {...props} />
    </Suspense>
  );
};

export default HeadOccluder;
