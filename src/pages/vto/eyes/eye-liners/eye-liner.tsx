import clsx from "clsx";
import { useState } from "react";
import { Icons } from "../../../../components/icons";
import { EyeLinerProvider, useEyeLinerContext } from "./eye-liner-context";
import { ColorPalette } from "../../../../components/color-palette";

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

export function EyeLinerSelector() {
  return (
    <EyeLinerProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <div>
          <FamilyColorSelector />

          <ColorSelector />
        </div>

        <ShapeSelector />

        <ProductList />
      </div>
    </EyeLinerProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useEyeLinerContext();

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

const gradients = [
  ["#342112", "#9A6035"],
  ["#3D2B1F", "#A37353"],
  ["#483C32", "#AE9179"],
  ["#4A2912", "#B0612C"],
  ["#4F300D", "#B56F1E"],
  ["#5C4033", "#C2876C"],
  ["#6A4B3A", "#D09372"],
  ["#7B3F00", "#E17300"],
  ["#8B4513", "#251205"],
];

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useEyeLinerContext();

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
          <button key={color} type="button">
            <ColorPalette
              size="large"
              palette={{
                color: color,
              }}
              selected={color === selectedColor}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const eyeliners = [
  "/eyeliners/eyeliners_arabic-down 1.png",
  "/eyeliners/eyeliners_arabic-light 1.png",
  "/eyeliners/eyeliners_arabic-up 1.png",
  "/eyeliners/eyeliners_double-mod 1.png",
  "/eyeliners/eyeliners_down-basic 1.png",
  "/eyeliners/eyeliners_down-bold 1.png",
  "/eyeliners/eyeliners_down-light 1.png",
  "/eyeliners/eyeliners_middle-basic 1.png",
  "/eyeliners/eyeliners_middle-bold 1.png",
  "/eyeliners/eyeliners_middle-light 1.png",
  "/eyeliners/eyeliners_open-wings 1.png",
  "/eyeliners/eyeliners_up-basic 1.png",
  "/eyeliners/eyeliners_up-bold 1.png",
  "/eyeliners/eyeliners_up-light 1.png",
];

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useEyeLinerContext();
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        {eyeliners.map((path, index) => (
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
            <img src={path} alt="Eyebrow" className="rounded size-12" />
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

  const { colorFamily } = useEyeLinerContext();

  return (
    <div className="flex w-full gap-4 overflow-x-auto !border-t-0 pb-2 pt-4 no-scrollbar active:cursor-grabbing">
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
