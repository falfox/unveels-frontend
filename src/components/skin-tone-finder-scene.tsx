// components/SkinToneFinderSceneThree.tsx
import { useEffect, useState, useRef } from "react";
import { useCamera } from "./recorder/recorder-context";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Canvas, useThree } from "@react-three/fiber";
import { TextureLoader, Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";

interface SkinToneFinderSceneProps {
  debugMode?: boolean; // Optional prop for debug mode
}

export function SkinToneFinderScene({
  debugMode = false,
}: SkinToneFinderSceneProps) {
  const { criterias } = useCamera();
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );
  const [landmarks, setLandmarks] = useState<Array<Array<number>>>([]); // Store landmarks as array of [x, y] normalized coordinates
  const [isLandmarkerReady, setIsLandmarkerReady] = useState<boolean>(false);

  // Load image when capturedImage changes
  useEffect(() => {
    if (criterias.capturedImage) {
      const image = new Image();
      image.src = criterias.capturedImage;
      image.crossOrigin = "anonymous"; // To avoid CORS issues
      image.onload = () => {
        setImageLoaded(image);
      };
      image.onerror = (err) => {
        console.error("Failed to load image:", err);
      };
    }
  }, [criterias.capturedImage]);

  // Initialize FaceLandmarker
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
        );
        const landmarker = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU", // Optional: use "GPU" if supported
            },
            outputFaceBlendshapes: true,
            runningMode: "IMAGE",
            numFaces: 1,
          },
        );
        setFaceLandmarker(landmarker);
        setIsLandmarkerReady(true);
      } catch (error) {
        console.error("Failed to initialize FaceLandmarker:", error);
      }
    };

    initializeFaceLandmarker();

    // Cleanup on unmount
    return () => {
      if (faceLandmarker) {
        faceLandmarker.close();
      }
    };
  }, []);

  // Process image and detect landmarks
  useEffect(() => {
    const processImage = async () => {
      if (imageLoaded && faceLandmarker && isLandmarkerReady) {
        try {
          const results = await faceLandmarker.detect(imageLoaded);
          if (results && results.faceLandmarks.length > 0) {
            // Assuming first face
            const firstFace = results.faceLandmarks[0];
            // Convert landmarks to normalized coordinates [0,1]
            const normalizedLandmarks = firstFace.map(
              (landmark) => [landmark.x, landmark.y] as [number, number],
            );
            setLandmarks(normalizedLandmarks);
            console.log("Detected Landmarks:", normalizedLandmarks); // Debugging
          }
        } catch (error) {
          console.error("Failed to detect face:", error);
        }
      }
    };

    processImage();
  }, [imageLoaded, faceLandmarker, isLandmarkerReady]);

  // If no image is captured, render nothing
  if (!criterias.capturedImage || !imageLoaded) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-screen">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 2], fov: 50 }}
        // Enable device pixel ratio for better clarity on mobile
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 5]} intensity={1} />
        <Scene
          image={imageLoaded}
          landmarks={landmarks}
          debugMode={debugMode}
        />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

interface SceneProps {
  image: HTMLImageElement;
  landmarks: Array<Array<number>>; // [ [x, y], ... ]
  debugMode: boolean;
}

function Scene({ image, landmarks, debugMode }: SceneProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { camera, size } = useThree();

  // State to store image aspect ratio
  const [imageAspect, setImageAspect] = useState<number>(1);

  // Load texture
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      image.src,
      (tex) => {
        tex.needsUpdate = true;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("Failed to load texture:", err);
      },
    );
  }, [image]);

  // Update image aspect ratio when image is loaded
  useEffect(() => {
    if (image) {
      const aspect = image.naturalWidth / image.naturalHeight;
      setImageAspect(aspect);
    }
  }, [image]);

  // Calculate plane dimensions based on image aspect ratio
  const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    const calculatePlaneSize = () => {
      const distance = camera.position.z;
      const fov = camera.fov * (Math.PI / 180); // Convert to radians
      const height = 2 * Math.tan(fov / 2) * distance;
      const width = height * (size.width / size.height);

      let finalWidth = width;
      let finalHeight = height;

      if (imageAspect > 1) {
        // Image is wider than tall
        finalWidth = height * imageAspect;
      } else if (imageAspect < 1) {
        // Image is taller than wide
        finalHeight = width / imageAspect;
      }

      setPlaneSize([finalWidth, finalHeight]);
    };

    calculatePlaneSize();
  }, [camera, size, imageAspect]);

  return (
    <>
      {texture && (
        <mesh>
          <planeGeometry args={[planeSize[0], planeSize[1]]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      )}
      {debugMode && landmarks.length > 0 && (
        <LandmarkSpheres landmarks={landmarks} planeSize={planeSize} />
      )}
    </>
  );
}

interface LandmarkSpheresProps {
  landmarks: Array<Array<number>>; // [ [x, y], ... ]
  planeSize: [number, number]; // [width, height]
}

function LandmarkSpheres({ landmarks, planeSize }: LandmarkSpheresProps) {
  const [width, height] = planeSize;

  // Convert normalized landmarks to Three.js coordinates
  const points = landmarks.map(([x, y]) => {
    // Map x from [0,1] to [-width/2, width/2]
    const posX = (x - 0.5) * width;

    // Map y from [0,1] to [height/2, -height/2] (invert Y axis)
    const posY = (0.5 - y) * height;

    // Slightly in front of the plane to prevent z-fighting
    const posZ = 0.01;

    return new Vector3(posX, posY, posZ);
  });

  console.log("Landmark Points:", points); // Debugging

  return (
    <>
      {points.map((point, index) => (
        <mesh
          key={index}
          position={[point.x, point.y, point.z]}
          renderOrder={1}
        >
          <sphereGeometry args={[0.005, 16, 16]} />{" "}
          {/* Increased size for visibility */}
          <meshBasicMaterial color="lime" />
        </mesh>
      ))}
    </>
  );
}
