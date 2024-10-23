import { useEffect, useState } from "react";
import { MeshProps, useThree } from "@react-three/fiber";
import { Landmark } from "../../types/landmark";
import { useTexture } from "@react-three/drei";
import { useSkinColor } from "./skin-color-context";
import Foundation from "../three/makeup/foundation";
import { LinearFilter, RGBFormat } from "three";

interface SkinToneFinderThreeSceneProps extends MeshProps {
  imageSrc: string;
  landmarks: Landmark[];
}

const SkinToneFinderThreeScene: React.FC<SkinToneFinderThreeSceneProps> = ({
  imageSrc,
  landmarks,
  ...props
}) => {
  const texture = useTexture(imageSrc);
  const { viewport } = useThree();
  const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);
  const { hexColor } = useSkinColor();

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

    texture.format = RGBFormat;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    setPlaneSize([planeWidth, planeHeight]);
  }, [texture, viewport]);
  1;

  return (
    <>
      <mesh position={[0, 0, -10]} {...props}>
        <planeGeometry args={[planeSize[0], planeSize[1]]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <Foundation planeSize={planeSize} landmarks={landmarks} />
    </>
  );
};

export default SkinToneFinderThreeScene;
