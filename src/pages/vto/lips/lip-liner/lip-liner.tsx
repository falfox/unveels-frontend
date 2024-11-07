import clsx from "clsx";
import { useState } from "react";
import { Icons } from "../../../../components/icons";
import { LipLinerProvider, useLipLinerContext } from "./lip-liner-context";
import { useMakeup } from "../../../../components/three/makeup-context";
import {
  buildSearchParams,
  getProductAttributes,
  mediaUrl,
} from "../../../../utils/apiUtils";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  lips_makeup_product_types,
  lipsMakeupProductTypesFilter,
} from "../../../../api/attributes/makeups";
import { useQuery } from "@tanstack/react-query";
import { BrandName } from "../../../../components/product/brand";
import { LoadingProducts } from "../../../../components/loading";

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

function useLipLinerQuery({
  color,
  sub_color,
  texture,
}: {
  color: string | null;
  sub_color: string | null;
  texture: string | null;
}) {
  return useQuery({
    queryKey: ["products", "lipliner", color, sub_color, texture],
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
              value: lipsMakeupProductTypesFilter(["Lip Liners"]),
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

export function LipLinerSelector() {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <FamilyColorSelector />

        <ColorSelector />
      </div>

      <SizeSelector />

      <ProductList />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useLipLinerContext();
  return (
    <div
      className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {colorFamilies.map((item, index) => (
        <button
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
            {
              "border-white/80": colorFamily === item.name,
            },
          )}
          onClick={() => setColorFamily(item.name)}
        >
          <div
            className="size-2.5 shrink-0 rounded-full"
            style={{
              background: item.value,
            }}
          />
          <span className="text-sm">{item.name}</span>
        </button>
      ))}
    </div>
  );
}

const colors = [
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
  const { selectedColor, setSelectedColor } = useLipLinerContext();
  const { setLiplinerColor, showLipliner, setShowLipliner } = useMakeup();

  function resetColor() {
    if (showLipliner) {
      setShowLipliner(false);
    }

    setSelectedColor(null);
  }

  function setColor(color: string) {
    if (!showLipliner) {
      setShowLipliner(true);
    }

    setSelectedColor(color);
    setLiplinerColor(color);
  }

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

        {colors.map((color, index) => (
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
        ))}
      </div>
    </div>
  );
}

// const sizes = [
//   "Small",
//   "Upper Lip",
//   "Large Lower",
//   "Large Narrower",
//   "Large & Full",
//   "Wider",
// ];

// Todo: Update the sizes to match the actual sizes
const lipLinerSizes = [
  "Small",
  // "Medium",
  // "Large",
  // "Extra Large",
];

function SizeSelector() {
  const { selectedSize, setSelectedSize } = useLipLinerContext();
  const { liplinerPattern, setLiplinerPattern } = useMakeup();

  function setPattern(pattern: number, patternName: string) {
    setLiplinerPattern(pattern);
    setSelectedSize(patternName);
  }

  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        {lipLinerSizes.map((size, index) => (
          <button
            key={size}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
              {
                "border-white/80": selectedSize === size,
              },
            )}
            onClick={() => setPattern(index, size)}
          >
            <img
              src={`/lipliners/lipliner ${size.toLowerCase()}.png`}
              alt={size}
              className="size-12"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductList() {
  const { colorFamily, selectedSize: selectedShade } = useLipLinerContext();

  const { data, isLoading } = useLipLinerQuery({
    color: colorFamily,
    sub_color: null,
    texture: null,
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
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
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
                  className="rounded object-cover"
                />
              </div>

              <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
                {product.name}
              </h3>
              <p className="text-[0.625rem] text-white/60">
                <BrandName brandId={getProductAttributes(product, "brand")} />{" "}
              </p>
              <div className="flex items-end justify-between space-x-1 pt-1">
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
