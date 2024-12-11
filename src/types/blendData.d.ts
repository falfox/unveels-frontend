// blendshape.d.ts

export interface Blendshapes {
  [key: string]: number;
  eyeBlinkLeft: number;
  eyeLookDownLeft: number;
  eyeLookInLeft: number;
  eyeLookOutLeft: number;
  eyeLookUpLeft: number;
  eyeSquintLeft: number;
  eyeWideLeft: number;
  eyeBlinkRight: number;
  eyeLookDownRight: number;
  eyeLookInRight: number;
  eyeLookOutRight: number;
  eyeLookUpRight: number;
  eyeSquintRight: number;
  eyeWideRight: number;
  jawForward: number;
  jawLeft: number;
  jawRight: number;
  jawOpen: number;
  mouthClose: number;
  mouthFunnel: number;
  mouthPucker: number;
  mouthLeft: number;
  mouthRight: number;
  mouthSmileLeft: number;
  mouthSmileRight: number;
  mouthFrownLeft: number;
  mouthFrownRight: number;
  mouthDimpleLeft: number;
  mouthDimpleRight: number;
  mouthStretchLeft: number;
  mouthStretchRight: number;
  mouthRollLower: number;
  mouthRollUpper: number;
  mouthShrugLower: number;
  mouthShrugUpper: number;
  mouthPressLeft: number;
  mouthPressRight: number;
  mouthLowerDownLeft: number;
  mouthLowerDownRight: number;
  mouthUpperUpLeft: number;
  mouthUpperUpRight: number;
  browDownLeft: number;
  browDownRight: number;
  browInnerUp: number;
  browOuterUpLeft: number;
  browOuterUpRight: number;
  cheekPuff: number;
  cheekSquintLeft: number;
  cheekSquintRight: number;
  noseSneerLeft: number;
  noseSneerRight: number;
  tongueOut: number;
  headRoll: number;
  leftEyeRoll: number;
  rightEyeRoll: number;
}

export interface BlendData {
  time: number;
  blendshapes: Blendshapes;
}
