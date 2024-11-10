import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { LineSegments, Mesh, SkinnedMesh } from "three";
import * as THREE from "three";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import createAnimation from "../../utils/converter";
import blinkData from "../../assets/blendDataBlink.json";
import { useLoadTextures } from "../../utils/textures";
import axios from "axios";
import { applyAvatarMaterials } from "../../utils/avatarMaterialUtils";
import { runBlendshapesDemo } from "./talking-head";

const host = "https://talking-avatar.onrender.com";

function googleTextToSpeech(text: string) {
  const apiKey = import.meta.env.VITE_BARD_API_KEY;
  if (!apiKey || !text) return;

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const data = {
    input: {
      text: text,
    },
    voice: {
      languageCode: "en-gb",
      name: "en-GB-Standard-A",
      ssmlGender: "FEMALE",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  };

  return axios
    .post(url, data)
    .then((response) => {
      const audioContent = response.data.audioContent;
      const audioBlob = toBlob(audioContent, "audio/mpeg");
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

// Fungsi untuk mengonversi base64 menjadi blob
function toBlob(base64: string, contentType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

function makeSpeech(text: string) {
  return axios.post(host + "/talk", { text });
}

interface AvatarProps {
  avatar_url: string;
  speak: boolean;
  text: string;
  setAudioSource: (audioSource: string) => void;
  playing: boolean;
  setSpeak: (speak: boolean) => void;
}

const Avatar = ({
  avatar_url,
  speak,
  text,
  playing,
  setAudioSource,
  setSpeak,
}: AvatarProps) => {
  const gltf = useGLTF(avatar_url);
  const textures = useLoadTextures();
  const mixer = useMemo(
    () => new THREE.AnimationMixer(gltf.scene),
    [gltf.scene],
  );

  const [clips, setClips] = useState<(THREE.AnimationClip | null)[]>([]);

  let morphTargetDictionaryBody: { [key: string]: number } | null | undefined =
    null;
  let morphTargetDictionaryLowerTeeth:
    | { [key: string]: number }
    | null
    | undefined = null;

  gltf.scene.traverse((node) => {
    if (
      node instanceof Mesh ||
      node instanceof LineSegments ||
      node instanceof SkinnedMesh
    ) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      applyAvatarMaterials(node, textures);

      if (node.name.includes("TeethLower")) {
        morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
      }

      if (node.name.includes("Body")) {
        morphTargetDictionaryBody = node.morphTargetDictionary;
      }
    }
  });

  useEffect(() => {
    if (speak === false) return;

    googleTextToSpeech(text)
      ?.then((response) => {
        const audioSource = response;
        runBlendshapesDemo(true, audioSource)
          .then((blendShape) => {
            const blendData = blendShape; // Hasil akhir blendshape
            console.log(blendData);

            if (morphTargetDictionaryBody) {
              const newClips = [
                createAnimation(
                  blendData,
                  morphTargetDictionaryBody,
                  "HG_Body",
                ),
                createAnimation(
                  blendData,
                  morphTargetDictionaryLowerTeeth || {},
                  "HG_TeethLower",
                ),
              ];
              setClips(newClips);
              setAudioSource(audioSource);
            }
          })
          .catch((err) => {
            console.error(err);
            setSpeak(false);
          });
      })
      .catch((err) => {
        console.error(err);
        setSpeak(false);
      });

    makeSpeech(text)
      .then((response) => {
        const { blendData, filename } = response.data;
        console.log(blendData);

        console.log(filename);
        if (morphTargetDictionaryBody) {
          const newClips = [
            createAnimation(blendData, morphTargetDictionaryBody, "HG_Body"),
            createAnimation(
              blendData,
              morphTargetDictionaryLowerTeeth || {},
              "HG_TeethLower",
            ),
          ];
          setClips(newClips);

          const audioSource = host + filename;
          setAudioSource(audioSource);
        }
      })
      .catch((err) => {
        console.error(err);
        setSpeak(false);
      });
  }, [
    speak,
    text,
    morphTargetDictionaryBody,
    morphTargetDictionaryLowerTeeth,
    setAudioSource,
    setSpeak,
  ]);

  const idleFbx = useFBX("/idle.fbx");
  const { clips: idleClips } = useAnimations(idleFbx.animations);

  idleClips[0].tracks = _.filter(idleClips[0].tracks, (track) => {
    return (
      track.name.includes("Head") ||
      track.name.includes("Neck") ||
      track.name.includes("Spine2")
    );
  });

  idleClips[0].tracks = _.map(idleClips[0].tracks, (track) => {
    if (track.name.includes("Head")) {
      track.name = "head.quaternion";
    }

    if (track.name.includes("Neck")) {
      track.name = "neck.quaternion";
    }

    if (track.name.includes("Spine")) {
      track.name = "spine2.quaternion";
    }

    return track;
  });

  useEffect(() => {
    const idleClipAction = mixer.clipAction(idleClips[0]);
    idleClipAction.play();

    const blinkClip = createAnimation(
      blinkData,
      morphTargetDictionaryBody!,
      "HG_Body",
    );
    if (blinkClip) {
      const blinkAction = mixer.clipAction(blinkClip);
      blinkAction.play();
    }
  }, [idleClips, mixer, morphTargetDictionaryBody]);

  // Play animation clips when available
  useEffect(() => {
    if (playing === false) return;

    _.each(clips, (clip) => {
      if (clip) {
        const clipAction = mixer.clipAction(clip);
        clipAction.setLoop(THREE.LoopOnce, 1);
        clipAction.play();
      }
    });
  }, [playing, clips, mixer]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <group name="avatar">
      <primitive object={gltf.scene} dispose={null} />
    </group>
  );
};

export default Avatar;
