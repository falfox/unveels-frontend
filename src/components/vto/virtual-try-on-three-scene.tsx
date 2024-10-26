import React, { useEffect, useRef, useState } from "react";
import { MeshProps, useThree } from "@react-three/fiber";
import { LinearFilter, RGBFormat, VideoTexture, DoubleSide } from "three";
import { ShaderMaterial } from "three";
import { Vector2 } from "three";
import { FaceShader } from "../../shaders/FaceShader"; // Adjust the import path accordingly
import Webcam from "react-webcam";
import { Landmark } from "../../types/landmark";
import FaceMesh from "../three/face-mesh";
import Foundation from "../three/makeup/foundation";

interface VirtualTryOnThreeSceneProps extends MeshProps {
  videoRef: React.RefObject<Webcam>;
  landmakrs: Landmark[];
}

const VirtualTryOnThreeScene: React.FC<VirtualTryOnThreeSceneProps> = ({
  videoRef,
  landmakrs,
  ...props
}) => {
  const { viewport } = useThree();
  const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);

  const filterRef = useRef<ShaderMaterial>(null);

  // Handle video readiness and create texture
  useEffect(() => {
    const video = videoRef.current?.video;
    if (!video) return;

    const handleCanPlay = () => {
      video.play();
      const texture = new VideoTexture(video);
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.format = RGBFormat;
      texture.needsUpdate = true;
      setVideoTexture(texture);
      console.log("VideoTexture created");
    };

    if (video.readyState >= 2) {
      // HAVE_CURRENT_DATA
      handleCanPlay();
    } else {
      video.addEventListener("canplay", handleCanPlay);
      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [videoRef]);

  // Update plane size based on video aspect ratio and viewport
  useEffect(() => {
    if (!videoTexture) return;

    const video = videoRef.current?.video;
    if (video) {
      const imageAspect = video.videoWidth / video.videoHeight;
      const viewportAspect = viewport.width / viewport.height;

      let planeWidth: number;
      let planeHeight: number;

      if (imageAspect > viewportAspect) {
        // Video is wider than viewport
        planeHeight = viewport.height;
        planeWidth = viewport.height * imageAspect;
      } else {
        // Video is taller or same aspect as viewport
        planeWidth = viewport.width;
        planeHeight = viewport.width / imageAspect;
      }

      setPlaneSize([planeWidth, planeHeight]);
      console.log(`Plane size set to ${planeWidth} x ${planeHeight}`);
    }
  }, [videoTexture, viewport, videoRef]);

  // Dispose of the texture on unmount
  useEffect(() => {
    return () => {
      if (videoTexture) {
        videoTexture.dispose();
        console.log("VideoTexture disposed");
      }
    };
  }, [videoTexture]);

  return (
    <>
      {videoTexture && (
        <>
          <mesh position={[0, 0, -5]} {...props}>
            <planeGeometry args={[planeSize[0], planeSize[1]]} />
            <shaderMaterial
              ref={filterRef}
              vertexShader={FaceShader.vertexShader}
              fragmentShader={FaceShader.fragmentShader}
              side={DoubleSide}
              uniforms={{
                videoTexture: { value: videoTexture },
                leftEyebrow: {
                  value: [
                    new Vector2(),
                    new Vector2(),
                    new Vector2(),
                    new Vector2(),
                    new Vector2(),
                  ],
                },
                rightEyebrow: {
                  value: [
                    new Vector2(),
                    new Vector2(),
                    new Vector2(),
                    new Vector2(),
                    new Vector2(),
                  ],
                },
                archFactor: { value: 0.1 },
                pinchFactor: { value: 0.1 },
                horizontalShiftFactor: { value: 0 },
                verticalShiftFactor: { value: 0 },
              }}
            />
          </mesh>
          <Foundation planeSize={planeSize} landmarks={landmakrs} />
        </>
      )}
    </>
  );
};

export default VirtualTryOnThreeScene;
