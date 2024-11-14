import clsx from "clsx";
import { Icons } from "../../../../components/icons";
import { ColorPalette } from "../../../../components/color-palette";
import { ContourProvider, useContourContext } from "./contour-context";
import { useRef } from "react";
import { useMakeup } from "../../../../context/makeup-context";
import { useQuery } from "@tanstack/react-query";
import { faceMakeupProductTypesFilter } from "../../../../api/attributes/makeups";
import {
  buildSearchParams,
  extractUniqueCustomAttributes,
  getProductAttributes,
  mediaUrl,
} from "../../../../utils/apiUtils";
import { defaultHeaders, Product } from "../../../../api/shared";
import { useCountdown } from "../../../../hooks/useCountdown";
import { LoadingProducts } from "../../../../components/loading";
import { BrandName } from "../../../../components/product/brand";
import { filterTextures } from "../../../../api/attributes/texture";
import Textures from "three/src/renderers/common/Textures.js";
import { useContourQuery } from "./contour-query";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";

const colors = [
  "#342112",
  "#3D2B1F",
  "#483C32",
  "#4A2912",
  "#4F300D",
  "#5C4033",
  "#6A4B3A",
  "#7B3F00",
  "#8B4513",
];

function useFaceContourQuery({
  texture,
  color,
}: {
  texture: string | null;
  color: string | null;
}) {
  return useQuery({
    queryKey: ["products", "facecontour", color, texture],
    queryFn: async () => {
      const filters = [
        {
          filters: [
            {
              field: "type_id",
              value: "simple",
              condition_type: "eq",
            },
          ],
        },
        {
          filters: [
            {
              field: "face_makeup_product_type",
              value: faceMakeupProductTypesFilter(["Contouring"]),
              condition_type: "in",
            },
          ],
        },
      ];

      if (color) {
        filters.push({
          filters: [
            {
              field: "color",
              value: color,
              condition_type: "eq",
            },
          ],
        });
      }

      if (texture) {
        filters.push({
          filters: [
            {
              field: "texture",
              value: texture,
              condition_type: "eq",
            },
          ],
        });
      }

      console.log("filters", filters);

      const response = await fetch(
        "/rest/V1/products?" + buildSearchParams(filters),
        {
          headers: defaultHeaders,
        },
      );

      const results = (await response.json()) as {
        items: Array<Product>;
      };

      return results;
    },
  });
}

export function ContourSelector() {
  return (
    <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
      <ColorSelector />
      <ModeSelector />
      <ShapeSelector />
      <TextureSelector />
      <ProductList />
    </div>
  );
}

function ColorSelector() {
  const {
    setContourColors,
    setContourMode,
    setShowContour,
    showContour,
    contourColors,
  } = useMakeup();
  const { selectedColors, setSelectedColors, selectedMode } =
    useContourContext();

  const { data } = useContourQuery({
    texture: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

  const handleColorClick = (color: string) => {
    if (!showContour) {
      setShowContour(true);
    }
    // Handle color deselection
    if (selectedColors.includes(color)) {
      const newColors = selectedColors.filter((c) => c !== color);
      setSelectedColors(newColors);
      setContourColors(newColors);
      return;
    }

    // Handle different modes
    const isMultiColorMode = selectedMode === "Dual";
    const maxColors = isMultiColorMode ? 2 : 1;

    setContourMode(isMultiColorMode ? "Dual" : "One");

    // Update colors by either adding new color or replacing the oldest one
    const newColors =
      selectedColors.length < maxColors
        ? [...selectedColors, color]
        : [...selectedColors.slice(1), color]; // Remove oldest, add new

    setSelectedColors(newColors);
    setContourColors(newColors);
  };

  const handleClearSelection = () => {
    setSelectedColors([]);
    setShowContour(false);
  };

  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
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

const modes = ["One", "Dual"];

function ModeSelector() {
  const { selectedMode, setSelectedMode, selectedColors, setSelectedColors } =
    useContourContext();
  const { setContourMode, contourColors, setContourColors } = useMakeup();

  function setMode(mode: string) {
    setSelectedMode(mode);

    if (mode == "One") {
      setContourMode(mode);
      if (selectedMode === "One" && contourColors.length > 1) {
        setSelectedColors([contourColors[0]]);
        setContourColors([contourColors[0]]);
      }
    }
  }

  return (
    <div className="w-full py-2 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        {modes.map((mode) => (
          <button
            key={mode}
            type="button"
            className={clsx(
              "relative inline-flex items-center gap-x-2 rounded-full px-3 py-1 text-center text-sm transition-transform",
              {
                "-translate-y-0.5 text-white": selectedMode === mode,
                "text-white/80": selectedMode !== mode,
              },
            )}
            onClick={() => setMode(mode)}
          >
            {selectedMode === mode ? (
              <div className="absolute inset-0 flex items-center justify-center text-white blur-sm backdrop-blur-sm">
                {mode}
              </div>
            ) : null}
            <span className="relative text-sm">{mode}</span>
          </button>
        ))}

        <div className="h-5 border border-r"></div>
      </div>
    </div>
  );
}

const contours = [
  "/contours/contour-1.png",
  "/contours/contour-2.png",
  "/contours/contour-3.png",
  "/contours/contour-4.png",
  "/contours/contour-5.png",
  "/contours/contour-6.png",
];

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useContourContext();
  const { setContourShape } = useMakeup();

  function setShape(shape: string) {
    setContourShape(shape);
    setSelectedShape(shape);
  }

  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        {contours.map((path, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center rounded-sm border border-transparent text-white/80",
              {
                "border-white/80": selectedShape === index.toString(),
              },
            )}
            onClick={() => setShape(index.toString())}
          >
            <img src={path} alt="Eyebrow" className="rounded size-12" />
          </button>
        ))}
      </div>
    </div>
  );
}

const textures = filterTextures(["Metallic", "Matte", "Shimmer"]);

function TextureSelector() {
  const { selectedTexture, setSelectedTexture } = useContourContext();
  const { highlighterMaterial, setHighlighterMaterial } = useMakeup();

  function setMaterial(
    material: number,
    texture: { label: string; value: string },
  ) {
    if (selectedTexture === texture.value) {
      setSelectedTexture(null);
    } else {
      setSelectedTexture(texture.value);
    }
    setHighlighterMaterial(material);
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
  const { selectedTexture } = useContourContext();

  const { data, isLoading } = useContourQuery({
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
