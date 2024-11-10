import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { skin_tones } from "../../../../api/attributes/skin_tone";
import { textures } from "../../../../api/attributes/texture";
import { ColorPalette } from "../../../../components/color-palette";
import { LoadingProducts } from "../../../../components/loading";
import { useMakeup } from "../../../../components/three/makeup-context";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { useFoundationContext } from "./foundation-context";
import { useFoundationQuery } from "./foundation-query";

export function FoundationSelector() {
  return (
    <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
      <div>
        <FamilyColorSelector />

        <ColorSelector />
      </div>

      <TextureSelector />

      <ProductList />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useFoundationContext();

  return (
    <div
      className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {skin_tones.map((item, index) => (
        <button
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
            {
              "border-white/80": colorFamily === item.id,
            },
          )}
          onClick={() => setColorFamily(item.id)}
        >
          <div
            className="size-2.5 shrink-0 rounded-full"
            style={{
              background: item.color,
            }}
          />
          <span className="text-sm">{item.name}</span>
        </button>
      ))}
    </div>
  );
}

function ColorSelector() {
  const { colorFamily, selectedColor, setSelectedColor } =
    useFoundationContext();
  const { setFoundationColor, showFoundation, setShowFoundation } = useMakeup();

  const { data } = useFoundationQuery({
    skin_tone: colorFamily,
    texture: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

  function setColor(color: string) {
    if (!showFoundation) {
      setShowFoundation(true);
    }
    setSelectedColor(color);
    setFoundationColor(color);
  }

  function resetFoundation() {
    setSelectedColor(null);
    setShowFoundation(false);
  }

  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex items-center border border-transparent rounded-full size-10 shrink-0 gap-x-2 text-white/80"
          onClick={() => {
            resetFoundation();
          }}
        >
          <Icons.empty className="size-10" />
        </button>
        {extracted_sub_colors
          ? extracted_sub_colors.map((color, index) => (
              <button type="button" key={index} onClick={() => setColor(color)}>
                <ColorPalette
                  key={index}
                  size="large"
                  palette={{
                    color: color,
                  }}
                  selected={selectedColor === color}
                />
              </button>
            ))
          : null}
      </div>
    </div>
  );
}

function TextureSelector() {
  const { selectedTexture, setSelectedTexture } = useFoundationContext();
  const { setBlushMaterial } = useMakeup();

  function setMaterial(
    material: number,
    texture: { label: string; value: string },
  ) {
    if (selectedTexture === texture.value) {
      setSelectedTexture(null);
    } else {
      setSelectedTexture(texture.value);
    }
    setBlushMaterial(material);
  }

  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        {textures.map((texture, index) => (
          <button
            key={texture.value}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
              {
                "border-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                  selectedTexture === texture.value,
              },
            )}
            onClick={() => setMaterial(index, texture)}
          >
            <span className="text-sm">{texture.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductList() {
  const { colorFamily, selectedTexture } = useFoundationContext();

  const { data, isLoading } = useFoundationQuery({
    skin_tone: colorFamily,
    texture: selectedTexture,
  });
  return (
    <div className="flex w-full gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {isLoading ? (
        <LoadingProducts />
      ) : (
        data?.items.map((product, index) => {
          return <VTOProductCard product={product} key={product.id} />;
        })
      )}
    </div>
  );
}
