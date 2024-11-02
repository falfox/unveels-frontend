import clsx from "clsx";
import { useState, useRef } from "react";
import { Icons } from "../../../../components/icons";
import { LipColorProvider, useLipColorContext } from "./lip-color-context";
import { useMakeup } from "../../../../components/three/makeup-context";
import { ColorPalette } from "../../../../components/color-palette";
import {
  lips_makeup_product_types,
  lipsMakeupProductTypesMap,
} from "../../../../api/attributes/makeups";
import { useQuery } from "@tanstack/react-query";
import {
  buildSearchParams,
  getProductAttributes,
  mediaUrl,
} from "../../../../utils/apiUtils";
import { defaultHeaders, Product } from "../../../../api/shared";
import { colors } from "../../../../api/attributes/color";
import { LoadingProducts } from "../../../../components/loading";
import { BrandName } from "../../../../components/product/brand";
import { textures } from "../../../../api/attributes/texture";

const colorFamilies = [
  { name: "Yellow", value: "#FFFF00" },
  { name: "Black", value: "#000000" },
  { name: "Silver", value: "#C0C0C0" },
  {
    name: "Gold",
    value:
      "linear-gradient(90deg, #CA9C43 0%, #C79A42 33%, #BE923E 56%, #AE8638 77%, #98752F 96%, #92702D 100%)",
  },
  { name: "Rose Gold", value: "#B76E79" },
  { name: "Brass", value: "#B5A642" },
  { name: "Gray", value: "#808080" },
  {
    name: "Multicolor",
    value:
      "linear-gradient(270deg, #E0467C 0%, #E55300 25.22%, #00E510 47.5%, #1400FF 72%, #FFFA00 100%)",
  },
  { name: "Pink", value: "#FE3699" },
  { name: "Beige", value: "#F2D3BC" },
  { name: "Brown", value: "#3D0B0B" },
  { name: "Red", value: "#FF0000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Purple", value: "#800080" },
  { name: "Blue", value: "#1400FF" },
  { name: "Green", value: "#52FF00" },
  { name: "Transparent", value: "none" },
  { name: "Orange", value: "#FF7A00" },
  { name: "Bronze", value: "#CD7F32" },
  { name: "Nude", value: "#E1E1A3" },
];

function useLipColorQuery({
  color,
  sub_color,
  texture,
}: {
  color: string | null;
  sub_color: string | null;
  texture: string | null;
}) {
  return useQuery({
    queryKey: ["products", "lipcolor", color, sub_color, texture],
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
              field: "lips_makeup_product_type",
              value: lips_makeup_product_types
                .map((item) => item.value)
                .join(","),
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

      if (sub_color) {
        filters.push({
          filters: [
            {
              field: "sub_color",
              value: sub_color,
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
export function LipColorSelector() {
  return (
    <LipColorProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <div>
          <FamilyColorSelector />

          <ColorSelector />
        </div>

        <TextureSelector />

        <ShadesSelector />

        <ProductList />
      </div>
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
  const { selectedColors, setSelectedColors, selectedMode } =
    useLipColorContext();
  const replaceIndexRef = useRef(0); // To track which color to replace next

  const handleColorClick = (color: string) => {
    if (!showLipColor) {
      setShowLipColor(true);
    }
    if (selectedColors.includes(color)) {
      // Deselect the color if it's already selected
      setSelectedColors(selectedColors.filter((c) => c !== color));
      setLipColors(selectedColors.filter((c) => c !== color));
    } else if (selectedMode === "One") {
      setLipColorMode("One");
      // In "One" mode, only one color can be selected
      setSelectedColors([color]);
      setLipColors([color]);
    } else if (selectedMode === "Dual") {
      setLipColorMode("Dual");
      if (selectedColors.length < 2) {
        // Add the color if less than two are selected
        setSelectedColors([...selectedColors, color]);
        setLipColors([...selectedColors, color]);
      } else {
        // Replace the color based on replaceIndexRef
        const newSelectedColors = [...selectedColors];
        newSelectedColors[replaceIndexRef.current] = color;
        setSelectedColors(newSelectedColors);
        setLipColors(newSelectedColors);
        // Update replaceIndexRef to alternate between 0 and 1
        replaceIndexRef.current = (replaceIndexRef.current + 1) % 2;
      }
    } else if (selectedMode === "Ombre") {
      setLipColorMode("Dual");
      if (selectedColors.length < 2) {
        // Add the color if less than two are selected
        setSelectedColors([...selectedColors, color]);
        setLipColors([...selectedColors, color]);
      } else {
        // Replace the color based on replaceIndexRef
        const newSelectedColors = [...selectedColors];
        newSelectedColors[replaceIndexRef.current] = color;
        setSelectedColors(newSelectedColors);
        setLipColors(newSelectedColors);
        // Update replaceIndexRef to alternate between 0 and 1
        replaceIndexRef.current = (replaceIndexRef.current + 1) % 2;
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedColors([]);
    replaceIndexRef.current = 0;
    setShowLipColor(false);
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
        {sub_color.map((color, index) => (
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
        ))}
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
  const { colorFamily, selectedTexture } = useLipColorContext();

  const { data, isLoading } = useLipColorQuery({
    color: colorFamily,
    sub_color: null,
    texture: selectedTexture,
  });

  const products = [
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Double Wear Stay-in-Place Foundation",
      brand: "Estée Lauder",
      price: 52,
      originalPrice: 60,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
  ];

  return (
    <div className="flex w-full gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {isLoading ? (
        <LoadingProducts />
      ) : (
        data?.items.map((product, index) => {
          const imageUrl =
            mediaUrl(product.media_gallery_entries[0].file) ??
            "https://picsum.photos/id/237/200/300";

          return (
            <div key={index} className="w-[100px] rounded shadow">
              <div className="relative h-[70px] w-[100px] overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Product"
                  className="object-cover rounded"
                />
              </div>

              <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
                {product.name}
              </h3>
              <p className="text-[0.625rem] text-white/60">
                <BrandName brandId={getProductAttributes(product, "brand")} />{" "}
              </p>
              <div className="flex items-end justify-between pt-1 space-x-1">
                <div className="bg-gradient-to-r from-[#CA9C43] to-[#92702D] bg-clip-text text-[0.625rem] text-transparent">
                  $15
                </div>
                <button
                  type="button"
                  className="flex h-7 items-center justify-center bg-gradient-to-r from-[#CA9C43] to-[#92702D] px-2.5 text-[0.5rem] font-semibold text-white"
                >
                  Add to cart
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
