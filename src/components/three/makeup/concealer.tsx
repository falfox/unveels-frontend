import { MeshProps, useLoader } from "@react-three/fiber";
import React, { useMemo, Suspense } from "react";
import { MeshBasicMaterial, TextureLoader } from "three";
import FaceMesh from "../face-mesh";
import { Landmark } from "../../../types/landmark";
import { useMakeup } from "../makeup-context";
import { CONCEALER_TEXTURE } from "../../../utils/constants";

interface ConcealerProps extends MeshProps {
  landmarks: Landmark[];
  planeSize: [number, number];
}

const ConcealerInner: React.FC<ConcealerProps> = ({ landmarks, planeSize }) => {
  const { concealerColor } = useMakeup();

  const concealerTexture = useLoader(TextureLoader, CONCEALER_TEXTURE);

  const concealerMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: concealerColor,
        transparent: true,
        opacity: 0.15,
        alphaMap: concealerTexture,
        alphaTest: 0,
      }),
    [concealerColor],
  );

  return (
    <FaceMesh
      landmarks={landmarks}
      material={concealerMaterial}
      planeSize={[planeSize[0], planeSize[1]]}
    />
  );
};

const Concealer: React.FC<ConcealerProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <ConcealerInner {...props} />
    </Suspense>
  );
};

export default Concealer;
