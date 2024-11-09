import clsx from "clsx";
import { colors } from "../../../../api/attributes/color";
import { textures } from "../../../../api/attributes/texture";
import { ColorPalette } from "../../../../components/color-palette";
import { Icons } from "../../../../components/icons";
import { LoadingProducts } from "../../../../components/loading";
import { useMakeup } from "../../../../components/three/makeup-context";
import { LipColorProvider, useLipColorContext } from "./lip-color-context";

import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { useLipColorQuery } from "./lip-color-query";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";

export function LipColorSelector() {
  return (
    <LipColorProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <div>
          <FamilyColorSelector />

          <ColorSelector />
        </div>
      </div>

      <TextureSelector />

      <ShadesSelector />

      <ProductList />
    </LipColorProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useLipColorContext();

  return (
    <div
      className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {colors.map((item, index) => (
        <button
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
            {
              "border-white/80": colorFamily === item.value,
            },
          )}
          onClick={() => setColorFamily(item.value)}
        >
          <div
            className="size-2.5 shrink-0 rounded-full"
            style={{
              background: item.hex,
            }}
          />
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

const sub_color = [
  "#E0467C",
  "#740039",
  "#8D0046",
  "#B20058",
  "#B51F69",
  "#DF1050",
  "#E31B7B",
  "#E861A4",
  "#FE3699",
];

function ColorSelector() {
  const {
    setLipColors,
    setLipColorMode,
    setShowLipColor,
    showLipColor,
    lipColors,
  } = useMakeup();
  const { selectedColors, setSelectedColors, selectedMode, colorFamily } =
    useLipColorContext();

  const handleColorClick = (color: string) => {
    if (!showLipColor) setShowLipColor(true);

    // Handle color deselection
    if (selectedColors.includes(color)) {
      const newColors = selectedColors.filter((c) => c !== color);
      setSelectedColors(newColors);
      setLipColors(newColors);
      return;
    }

    // Handle different modes
    const isMultiColorMode =
      selectedMode === "Dual" || selectedMode === "Ombre";
    const maxColors = isMultiColorMode ? 2 : 1;
    setLipColorMode(isMultiColorMode ? "Dual" : "One");

    // Update colors by either adding new color or replacing the oldest one
    const newColors =
      selectedColors.length < maxColors
        ? [...selectedColors, color]
        : [...selectedColors.slice(1), color]; // Remove oldest, add new

    setSelectedColors(newColors);
    setLipColors(newColors);
  };

  const handleClearSelection = () => {
    setSelectedColors([]);

    setShowLipColor(false);
  };

  const { data } = useLipColorQuery({
    color: colorFamily,
    sub_color: null,
    texture: null,
  });

  if (!colorFamily) {
    return null;
  }

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  );

  return (
    <div className="w-full pt-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex items-center border border-transparent rounded-full size-10 shrink-0 gap-x-2 text-white/80"
          onClick={handleClearSelection}
        >
          <Icons.empty className="size-10" />
        </button>
        {extracted_sub_colors
          ? extracted_sub_colors.map((color, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleColorClick(color)}
                className={clsx("cursor-pointer")}
              >
                <ColorPalette
                  size="large"
                  palette={{ color }}
                  selected={selectedColors.includes(color)}
                />
              </button>
            ))
          : null}
      </div>
      {/* Removed the error message since all buttons are enabled */}
    </div>
  );
}

function TextureSelector() {
  const { selectedTexture, setSelectedTexture } = useLipColorContext();
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

const shades = ["One", "Dual", "Ombre"];

function ShadesSelector() {
  const { setSelectedMode, selectedMode, setSelectedColors, setReplaceIndex } =
    useLipColorContext();
  const { setLipColorMode, lipColors, setLipColors } = useMakeup();

  function setMode(mode: string) {
    setSelectedMode(mode);
    if (mode == "Dual") {
      setLipColorMode(mode);
    }
    if (mode == "Ombre") {
      setLipColorMode(mode);
    }

    if (mode === "One" && lipColors.length > 1) {
      const newColors = [lipColors[0]];
      setSelectedColors(newColors);
      setLipColors(newColors);
      setReplaceIndex(0);
    }
  }

  return (
    <div className="w-full py-2 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        {shades.map((shade, index) => (
          <button
            key={shade}
            type="button"
            className={clsx(
              "relative inline-flex items-center gap-x-2 rounded-full px-3 py-1 text-center text-sm transition-transform",
              {
                "-translate-y-0.5 text-white": selectedMode === shade,
                "text-white/80": selectedMode !== shade,
              },
            )}
            onClick={() => setMode(shade)}
          >
            {selectedMode === shade ? (
              <div className="absolute inset-0 flex items-center justify-center text-white blur-sm backdrop-blur-sm">
                {shade}
              </div>
            ) : null}
            <span className="relative text-sm">{shade}</span>
          </button>
        ))}

        <div className="h-5 border border-r"></div>
      </div>
    </div>
  );
}

function ProductList() {
  const { colorFamily, selectedTexture, selectedColors } = useLipColorContext();

  const { data, isLoading } = useLipColorQuery({
    color: colorFamily,
    sub_color: selectedColors[0],
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
