import clsx from "clsx";
import { textures } from "../../../../api/attributes/texture";
import { Icons } from "../../../../components/icons";
import { LoadingProducts } from "../../../../components/loading";
import { useMakeup } from "../../../../components/three/makeup-context";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { useLipPlumperContext } from "./lip-plumper-context";
import { useLipPlumperQuery } from "./lip-plumper-query";

export function LipPlumperSelector() {
  return (
    <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
      <div>
        <ColorSelector />
      </div>

      <TextureSelector />

      <ProductList />
    </div>
  );
}

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useLipPlumperContext();

  const { setLipplumperColor, showLipplumper, setShowLipplumper } = useMakeup();

  const { data } = useLipPlumperQuery({
    hexacode: null,
    texture: null,
  });

  function resetColor() {
    if (showLipplumper) {
      setShowLipplumper(false);
    }

    setSelectedColor(null);
  }

  function setColor(color: string) {
    if (!showLipplumper) {
      setShowLipplumper(true);
    }

    setSelectedColor(color);
    setLipplumperColor(color);
  }

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  );

  console.log({
    extracted_sub_colors,
  });

  return (
    <div className="w-full py-2 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex items-center border border-transparent rounded-full size-10 shrink-0 gap-x-2 text-white/80"
          onClick={() => {
            resetColor();
          }}
        >
          <Icons.empty className="size-10" />
        </button>

        {extracted_sub_colors
          ? extracted_sub_colors.map((color, index) => (
              <button
                key={color}
                type="button"
                className={clsx(
                  "inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80",
                  {
                    "border-white/80": selectedColor === color,
                  },
                )}
                style={{ background: color }}
                onClick={() => setColor(color)}
              ></button>
            ))
          : null}
      </div>
    </div>
  );
}

function TextureSelector() {
  const { selectedTexture, setSelectedTexture } = useLipPlumperContext();
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        {textures.map((texture, index) => (
          <button
            key={texture.label}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
              {
                "border-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                  selectedTexture === texture.value,
              },
            )}
            onClick={() => {
              if (selectedTexture === texture.value) {
                setSelectedTexture(null);
              } else {
                setSelectedTexture(texture.value);
              }
            }}
          >
            <span className="text-sm">{texture.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductList() {
  const { selectedColor, selectedTexture } = useLipPlumperContext();

  const { data, isLoading } = useLipPlumperQuery({
    hexacode: selectedColor,
    texture: selectedTexture,
  });

  return (
    <div className="flex w-full gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {isLoading ? (
        <LoadingProducts />
      ) : (
        data?.items.map((product, index) => {
          return <VTOProductCard key={product.id} product={product} />;
        })
      )}
    </div>
  );
}
