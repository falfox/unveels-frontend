import React, { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, MeshProps, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import FaceMesh from "../three/face-mesh";
import { Landmark } from "../../types/landmark";
import { BilateralFilterShader } from "../../shaders/BilateralFilterShader";
import {
  Vector2,
  ShaderMaterial,
  LinearFilter,
  CanvasTexture,
  RGBFormat,
  DoubleSide,
  RedFormat,
} from "three";
import { computeConvexHull } from "../../utils/imageProcessing";

// Komponen untuk menampilkan gambar menggunakan React Three Fiber
interface SkinAnalysisThreeSceneProps extends MeshProps {
  imageSrc: string;
  landmarks: Landmark[];
}

const SkinAnalysisThreeScene: React.FC<SkinAnalysisThreeSceneProps> = ({
  imageSrc,
  landmarks,
  ...props
}) => {
  const texture = useTexture(imageSrc);
  const { viewport } = useThree();
  const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);

  const filterRef = useRef<ShaderMaterial>(null);

  // State for window size and DPR
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
    dpr: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
  });

  // Handle window resize to update windowSize state
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate plane size based on image aspect ratio and viewport
  useEffect(() => {
    if (!texture.image) return;

    const imageAspect = texture.image.width / texture.image.height;
    const viewportAspect = viewport.width / viewport.height;

    let planeWidth: number;
    let planeHeight: number;

    if (imageAspect > viewportAspect) {
      // Image is wider than viewport
      planeHeight = viewport.height;
      planeWidth = viewport.height * imageAspect;
    } else {
      // Image is taller or same aspect as viewport
      planeWidth = viewport.width;
      planeHeight = viewport.width / imageAspect;
    }

    setPlaneSize([planeWidth, planeHeight]);
  }, [texture, viewport]);

  // State for shader parameters
  const [sigmaSpatial, setSigmaSpatial] = useState<number>(500.0);
  const [sigmaColor, setSigmaColor] = useState<number>(0.08);
  const [smoothingStrength, setSmoothingStrength] = useState<number>(1.25);

  // Create mask texture based on landmarks and window size
  const maskTexture = useMemo(() => {
    if (!texture.image) return null;

    const { width, height, dpr } = windowSize;

    // Create an off-screen canvas for the mask
    const canvas = document.createElement("canvas");
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Scale the context based on DPR
    ctx.scale(dpr, dpr);

    // Calculate aspect ratios
    const imgAspect = texture.image.width / texture.image.height;
    const canvasAspect = width / height;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (imgAspect < canvasAspect) {
      drawWidth = width;
      drawHeight = width / imgAspect;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgAspect;
      drawHeight = height;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }

    // Convert landmarks to pixel coordinates relative to the mask canvas
    const points: [number, number][] = landmarks.map((landmark) => [
      landmark.x * drawWidth + offsetX,
      landmark.y * drawHeight + offsetY,
    ]);

    // Compute Convex Hull
    const hull = computeConvexHull(points);

    if (hull.length < 3) return null; // Not enough points to form a polygon

    ctx.beginPath();
    hull.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = "white"; // White face area
    ctx.fill();

    // Create a Three.js texture from the canvas
    const mask = new CanvasTexture(canvas);
    mask.minFilter = LinearFilter;
    mask.magFilter = LinearFilter;
    mask.format = RedFormat;
    mask.needsUpdate = true;
    return mask;
  }, [landmarks, texture.image, windowSize]);

  useEffect(() => {
    if (maskTexture) {
      const link = document.createElement("img");
      link.src = maskTexture.image.toDataURL();
    }
  }, [maskTexture]);

  // Reference to the ShaderMaterial to update uniforms dynamically
  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.uniforms.imageTexture.value = texture;
      filterRef.current.uniforms.maskTexture.value = maskTexture;
      filterRef.current.uniforms.resolution.value.set(
        maskTexture?.image.width,
        maskTexture?.image.height,
      );
      filterRef.current.uniforms.sigmaSpatial.value = sigmaSpatial;
      filterRef.current.uniforms.sigmaColor.value = sigmaColor;
      filterRef.current.uniforms.smoothingStrength.value = smoothingStrength;
      filterRef.current.needsUpdate = true;
    }
  }, [texture, maskTexture, sigmaSpatial, sigmaColor, smoothingStrength]);

  return (
    <>
      {maskTexture && (
        <mesh position={[0, 0, -10]} {...props}>
          <planeGeometry args={[planeSize[0], planeSize[1]]} />
          <shaderMaterial
            ref={filterRef}
            args={[
              {
                vertexShader: BilateralFilterShader.vertexShader,
                fragmentShader: BilateralFilterShader.fragmentShader,
                side: DoubleSide,
                uniforms: {
                  imageTexture: { value: texture },
                  maskTexture: { value: maskTexture },
                  resolution: {
                    value: new Vector2(
                      maskTexture.image.width,
                      maskTexture.image.height,
                    ),
                  },
                  sigmaSpatial: { value: sigmaSpatial },
                  sigmaColor: { value: sigmaColor },
                  smoothingStrength: { value: smoothingStrength },
                },
              },
            ]}
          />
        </mesh>
      )}
    </>
  );
};

export default SkinAnalysisThreeScene;
