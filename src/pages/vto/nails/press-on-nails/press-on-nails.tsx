import clsx from "clsx";
import { useState } from "react";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import {
  PressOnNailsProvider,
  usePressOnNailsContext,
} from "./press-on-nails-context";

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

export function PressOnNailsSelector() {
  return (
    <PressOnNailsProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <div>
          <FamilyColorSelector />

          <ColorSelector />
        </div>

        <ShapeSelector />

        <ProductList />
      </div>
    </PressOnNailsProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = usePressOnNailsContext();

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
  const { selectedColor, setSelectedColor } = usePressOnNailsContext();

  return (
    <div className="w-full py-2 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex items-center border border-transparent rounded-full size-10 shrink-0 gap-x-2 text-white/80"
          onClick={() => {
            setSelectedColor(null);
          }}
        >
          <Icons.empty className="size-10" />
        </button>

        {colors.map((color, index) => (
          <ColorPalette
            size="large"
            palette={{
              color: color,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const nailshapes = [
  "/nailshapes/press on nails-1.png",
  "/nailshapes/press on nails-2.png",
  "/nailshapes/press on nails-3.png",
];

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = usePressOnNailsContext();
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        {nailshapes.map((path, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center rounded-sm border border-transparent text-white/80",
              {
                "border-white/80": selectedShape === index.toString(),
              },
            )}
            onClick={() => setSelectedShape(index.toString())}
          >
            <img src={path} alt="Highlighter" className="rounded size-12" />
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

  return (
    <div className="flex w-full gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {products.map((product, index) => (
        <div key={index} className="w-[100px] rounded shadow">
          <div className="relative h-[70px] w-[100px] overflow-hidden">
            <img
              src={"https://picsum.photos/id/237/200/300"}
              alt="Product"
              className="object-cover rounded"
            />
          </div>

          <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
            {product.name}
          </h3>
          <p className="text-[0.625rem] text-white/60">{product.brand}</p>
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
      ))}
    </div>
  );
}
