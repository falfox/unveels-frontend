import React, { useEffect, useRef, useState } from "react";
import { MeshProps, useFrame, useThree } from "@react-three/fiber";
import { LinearFilter, RGBFormat, VideoTexture, DoubleSide } from "three";
import { ShaderMaterial, Vector2 } from "three";
import { FaceShader } from "../../shaders/FaceShader";
import Webcam from "react-webcam";
import { Landmark } from "../../types/landmark";
import Foundation from "../three/makeup/foundation";
import { useMakeup } from "../three/makeup-context";
import Blush from "../three/makeup/blush";
import Concealer from "../three/makeup/concealer";
import Highlighter from "../three/makeup/highlighter";
import Contour from "../three/makeup/contour";
import Lipliner from "../three/makeup/lipliner";
import Lipplumper from "../three/makeup/lipplumper";
import LipColor from "../three/makeup/lipcolor";
import Bronzer from "../three/makeup/bronzer";
import ContactLens from "../three/makeup/contact-lens";
import Eyebrows from "../three/makeup/eyebrows";
import HeadOccluder from "../three/accesories/head-occluder";

interface VirtualTryOnThreeSceneProps extends MeshProps {
  videoRef: React.RefObject<Webcam>;
  landmarks: React.RefObject<Landmark[]>;
}

const VirtualTryOnThreeScene: React.FC<VirtualTryOnThreeSceneProps> = ({
  videoRef,
  landmarks,
  ...props
}) => {
  const { viewport } = useThree();
  const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);
  const {
    showFoundation,
    showBlush,
    showConcealer,
    showHighlighter,
    showContour,
    showLipliner,
    showLipplumper,
    showLipColor,
    showBronzer,
    showLens,
    showEyebrows,
  } = useMakeup();

  const filterRef = useRef<ShaderMaterial>(null);

  // State for slider-controlled factors
  const [archFactor, setArchFactor] = useState(0.1);
  const [pinchFactor, setPinchFactor] = useState(0.1);
  const [horizontalShiftFactor, setHorizontalShiftFactor] = useState(0);
  const [verticalShiftFactor, setVerticalShiftFactor] = useState(0);

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

  useFrame(() => {
    if (filterRef.current && landmarks.current) {
      const uniforms = filterRef.current.uniforms;

      // Update factor uniforms
      uniforms.archFactor.value = archFactor;
      uniforms.pinchFactor.value = pinchFactor;
      uniforms.horizontalShiftFactor.value = horizontalShiftFactor;
      uniforms.verticalShiftFactor.value = verticalShiftFactor;

      const faceLandmarks = landmarks.current;

      const leftEyebrowIndices = [63, 105, 66, 107];
      const rightEyebrowIndices = [296, 334, 293, 300];

      for (let i = 0; i < 4; i++) {
        const leftLandmark = faceLandmarks[leftEyebrowIndices[i]];
        const rightLandmark = faceLandmarks[rightEyebrowIndices[i]];

        if (leftLandmark && rightLandmark) {
          uniforms.leftEyebrow.value[i].set(
            leftLandmark.x,
            1.0 - leftLandmark.y,
          );

          uniforms.rightEyebrow.value[i].set(
            rightLandmark.x,
            1.0 - rightLandmark.y,
          );
        }
      }

      // Mark the material as needing an update
      filterRef.current.needsUpdate = true;
    }
  });

  return (
    <>
      {videoTexture && (
        <>
          <mesh position={[0, 0, -500]} {...props}>
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
                  ],
                },
                rightEyebrow: {
                  value: [
                    new Vector2(),
                    new Vector2(),
                    new Vector2(),
                    new Vector2(),
                  ],
                },
                archFactor: { value: archFactor },
                pinchFactor: { value: pinchFactor },
                horizontalShiftFactor: { value: horizontalShiftFactor },
                verticalShiftFactor: { value: verticalShiftFactor },
              }}
            />
          </mesh>

          {showFoundation && (
            <Foundation planeSize={planeSize} landmarks={landmarks} />
          )}

          {showBlush && <Blush planeSize={planeSize} landmarks={landmarks} />}

          {showConcealer && (
            <Concealer planeSize={planeSize} landmarks={landmarks} />
          )}

          {showHighlighter && (
            <Highlighter planeSize={planeSize} landmarks={landmarks} />
          )}

          {showContour && (
            <Contour planeSize={planeSize} landmarks={landmarks} />
          )}

          {showLipliner && (
            <Lipliner planeSize={planeSize} landmarks={landmarks} />
          )}

          {showLipplumper && (
            <Lipplumper planeSize={planeSize} landmarks={landmarks} />
          )}

          {showLipColor && (
            <LipColor planeSize={planeSize} landmarks={landmarks} />
          )}

          {showBronzer && (
            <Bronzer planeSize={planeSize} landmarks={landmarks} />
          )}

          {showLens && (
            <ContactLens planeSize={planeSize} landmarks={landmarks} />
          )}

          {showEyebrows && (
            <Eyebrows planeSize={planeSize} landmarks={landmarks} />
          )}

          <HeadOccluder planeSize={planeSize} landmarks={landmarks} />
        </>
      )}
    </>
  );
};

export default VirtualTryOnThreeScene;
