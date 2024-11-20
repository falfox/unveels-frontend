import * as THREE from "three";
import { faces, positions, uvs } from "../utils/constants";
import { Landmark } from "lucide-react";

// Interface pesan yang diterima dari main thread
interface WorkerMessage {
  imageData: ImageBitmap;
  width: number;
  height: number;
  canvas: OffscreenCanvas;
}

self.onmessage = (event) => {
  const { canvas, width, height, imageData, landmarks } = event.data;

  console.log(landmarks);

  if (!(canvas instanceof OffscreenCanvas)) {
    console.error("Canvas yang diterima bukan OffscreenCanvas.");
    return;
  }

  // Setup renderer dengan OffscreenCanvas
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = 1;
  renderer.setSize(width, height, false);

  // Scene dan kamera ortografi
  const scene = new THREE.Scene();
  const aspectRatio = width / height;
  const frustumSize = height; // Frustum setinggi viewport
  const camera = new THREE.OrthographicCamera(
    (-frustumSize * aspectRatio) / 2, // left
    (frustumSize * aspectRatio) / 2, // right
    frustumSize / 2, // top
    -frustumSize / 2, // bottom
    0.1, // near
    1000, // far
  );
  camera.position.z = 10;

  // Hitung rasio aspek gambar dan viewport
  const imageAspect = imageData.width / imageData.height;
  const viewportAspect = width / height;

  let planeWidth: number;
  let planeHeight: number;

  // Sesuaikan ukuran plane berdasarkan rasio aspek
  if (imageAspect > viewportAspect) {
    // Gambar lebih lebar dari viewport
    planeHeight = frustumSize;
    planeWidth = frustumSize * imageAspect;
  } else {
    // Gambar lebih tinggi atau sama dengan viewport
    planeWidth = frustumSize * aspectRatio;
    planeHeight = (frustumSize * aspectRatio) / imageAspect;
  }

  // Buat plane geometry dengan ukuran yang dihitung
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

  // Buat texture dari ImageBitmap
  const texture = new THREE.Texture(imageData);
  texture.flipY = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  plane.scale.y = -1; // Membalikkan sumbu Y
  plane.position.set(0, 0, -10); // Pusatkan plane
  scene.add(plane);

  // Create the face mesh geometry
  const geom = new THREE.BufferGeometry();
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

  geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geom.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));
  geom.setIndex(faces);
  geom.computeVertexNormals();

  const greenMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 }, // Initial value for time uniform
      baseColor: { value: new THREE.Color(0x00ff00) }, // Base color green
    },
    vertexShader: `
      varying vec2 vUv;
  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 baseColor;
      varying vec2 vUv;
  
      void main() {
        // Pulsing effect based on time and x-component of UV coordinates
        float pulse = abs(sin(time + vUv.x * 10.0)); 
        vec3 color = mix(baseColor, vec3(0.0, 0.5, 1.0), pulse); // Gradient from green to blue
        gl_FragColor = vec4(color, 0.2); // Set the color with transparency
      }
    `,
    transparent: true,
  });

  const faceMesh = new THREE.Mesh(geom, greenMaterial);
  faceMesh.position.set(0, 0, 0.1); // Sedikit di depan plane gambar
  scene.add(faceMesh);

  const meshPositions = faceMesh.geometry.attributes.position.array;

  for (let i = 0; i < landmarks.length; i++) {
    // Update posisi x
    meshPositions[i * 3] = (landmarks[i].x - 0.5) * planeWidth;

    // Update posisi y
    meshPositions[i * 3 + 1] = -(landmarks[i].y - 0.5) * planeHeight;

    // Update posisi z (skala disesuaikan untuk kedalaman)
    meshPositions[i * 3 + 2] = -landmarks[i].z;
  }

  // Tandai bahwa posisi mesh telah diubah
  faceMesh.geometry.attributes.position.needsUpdate = true;

  // Render loop
  const animate = () => {
    greenMaterial.uniforms.time.value += 0.05; // Increment time for animation
    renderer.render(scene, camera);
    self.requestAnimationFrame(animate);
  };

  animate();
};
