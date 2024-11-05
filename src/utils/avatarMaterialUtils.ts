import {
  LineBasicMaterial,
  Mesh,
  MeshPhysicalMaterial,
  SkinnedMesh,
  LineSegments,
  Vector2,
} from "three";
import * as THREE from "three";

interface Textures {
  bodyTexture: THREE.Texture;
  bodyRoughnessTexture: THREE.Texture;
  bodyNormalTexture: THREE.Texture;
  eyesTexture: THREE.Texture;
  teethTexture: THREE.Texture;
  teethNormalTexture: THREE.Texture;
  hairTexture: THREE.Texture;
  hairAlphaTexture: THREE.Texture;
  hairNormalTexture: THREE.Texture;
  hairRoughnessTexture: THREE.Texture;
  tshirtDiffuseTexture: THREE.Texture;
  tshirtRoughnessTexture: THREE.Texture;
  tshirtNormalTexture: THREE.Texture;
}

export function applyAvatarMaterials(
  node: Mesh | LineSegments | SkinnedMesh,
  textures: Textures,
) {
  node.castShadow = true;
  node.receiveShadow = true;
  node.frustumCulled = false;

  if (node.name.includes("Body")) {
    node.material = new MeshPhysicalMaterial({
      map: textures.bodyTexture,
      roughness: 1.7,
      roughnessMap: textures.bodyRoughnessTexture,
      normalMap: textures.bodyNormalTexture,
      normalScale: new Vector2(0.6, 0.6),
      envMapIntensity: 0.8,
    });
  } else if (node.name.includes("Eyes")) {
    node.material = new THREE.MeshStandardMaterial({
      map: textures.eyesTexture,
      roughness: 0.1,
      envMapIntensity: 0.5,
    });
  } else if (node.name.includes("Brows")) {
    node.material = new LineBasicMaterial({
      color: 0x000000,
      linewidth: 1,
      opacity: 0.5,
      transparent: true,
    });
    node.visible = false;
  } else if (node.name.includes("Teeth")) {
    node.material = new THREE.MeshStandardMaterial({
      map: textures.teethTexture,
      roughness: 0.1,
      normalMap: textures.teethNormalTexture,
      envMapIntensity: 0.7,
    });
  } else if (node.name.includes("Hair")) {
    node.material = new THREE.MeshStandardMaterial({
      map: textures.hairTexture,
      alphaMap: textures.hairAlphaTexture,
      normalMap: textures.hairNormalTexture,
      roughnessMap: textures.hairRoughnessTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x000000),
      envMapIntensity: 0.3,
    });
  } else if (node.name.includes("TSHIRT")) {
    node.material = new THREE.MeshStandardMaterial({
      map: textures.tshirtDiffuseTexture,
      roughnessMap: textures.tshirtRoughnessTexture,
      normalMap: textures.tshirtNormalTexture,
      color: new THREE.Color(0xffffff),
      envMapIntensity: 0.5,
    });
  }
}
