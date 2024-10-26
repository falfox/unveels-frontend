import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import { FoundationProvider, useFoundationContext } from "./foundation-context";
import {
  MakeupProvider,
  useMakeup,
} from "../../../../components/three/makeup-context";
import { useEffect } from "react";

const colorFamilies = [
  { name: "Light Skin", value: "#FAD4B4" },
  { name: "Medium Skin", value: "#D18B59" },
  { name: "Dark Skin", value: "#4B2F1B" },
];

export function FoundationSelector() {
  return (
    <FoundationProvider>
      <div className="mx-auto w-full px-4 lg:max-w-xl">
        <FamilyColorSelector />

        <ColorSelector />

        <ProductList />
      </div>
    </FoundationProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useFoundationContext();

  return (
    <div
      className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar"
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

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useFoundationContext();
  const { setFoundationColor, showFoundation, setShowFoundation } = useMakeup();

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
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80"
          onClick={() => {
            resetFoundation();
          }}
        >
          <Icons.empty className="size-10" />
        </button>
        {colors.map((color, index) => (
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
        ))}
      </div>
    </div>
  );
}

function ProductList() {
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

  const { colorFamily } = useFoundationContext();

  return (
    <div className="flex w-full gap-4 overflow-x-auto border-t border-white pb-2 pt-4 no-scrollbar active:cursor-grabbing">
      {products.map((product, index) => (
        <div key={index} className="w-[100px] rounded shadow">
          <div className="relative h-[70px] w-[100px] overflow-hidden">
            <img
              src={"https://picsum.photos/id/237/200/300"}
              alt="Product"
              className="rounded object-cover"
            />
          </div>

          <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
            {product.name}
          </h3>
          <p className="text-[0.625rem] text-white/60">{product.brand}</p>
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
      ))}
    </div>
  );
}
