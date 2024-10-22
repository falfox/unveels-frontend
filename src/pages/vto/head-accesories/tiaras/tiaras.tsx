import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import { Link } from "react-router-dom";

import { cloneElement } from "react";
import { TiaraProvider, useTiaraContext } from "./tiaras-context";

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

export function TiaraSelector() {
  return (
    <TiaraProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <FamilyColorSelector />
        <ColorSelector />
        <ModeSelector />
        <TiaraProductList />
      </div>
    </TiaraProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useTiaraContext();

  return (
    <div
      className="flex items-center w-full py-2 space-x-2 overflow-x-auto no-scrollbar"
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
  "#FFFFFF",
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
  const { selectedColor, setSelectedColor } = useTiaraContext();

  return (
    <div className="mx-auto w-full !border-t-0 pb-4 lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
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
          <button
            type="button"
            key={index}
            onClick={() => setSelectedColor(color)}
          >
            <ColorPalette
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

function ModeSelector() {
  const { selectedMode, setSelectedMode } = useTiaraContext();

  return (
    <>
      <div className="flex items-center justify-between w-full h-10 text-center">
        <button
          className={clsx("relative h-10 grow text-lg", {
            "text-white": selectedMode === "occasions",
            "text-white/60": selectedMode !== "occasions",
          })}
          onClick={() => setSelectedMode("occasions")}
        >
          Occasion
        </button>
        <div className="h-5 border-r border-white"></div>
        <button
          className={clsx("relative h-10 grow text-lg", {
            "text-white": selectedMode === "fabrics",
            "text-white/60": selectedMode !== "fabrics",
          })}
          onClick={() => setSelectedMode("fabrics")}
        >
          Fabric
        </button>
      </div>

      {selectedMode === "occasions" ? <OccasionSelector /> : <FabricSelector />}
    </>
  );
}

const occasions = ["Bridal", "Soiree"];

function OccasionSelector() {
  const { selectedOccasion, setSelectedOccasion } = useTiaraContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto !border-t-0 py-2 no-scrollbar">
      {occasions.map((occasion, index) => (
        <button
          key={occasion}
          type="button"
          className={clsx(
            "inline-flex items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80 shrink-0",
            {
              "selectedShape-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                selectedOccasion === occasion,
            },
          )}
          onClick={() => setSelectedOccasion(occasion)}
        >
          <span className="text-sm">{occasion}</span>
        </button>
      ))}
    </div>
  );
}

const materials = [
  {
    name: "Pearls",
    image: "/tiara-materials/e4108386-f7a9-4342-ba51-c163dd965967 1.png",
  },
  {
    name: "Crystals",
    image: "/tiara-materials/7a9885af-a00a-4a07-8a3b-b8f8e5eb059d 1.png",
  },
  {
    name: "Rubies",
    image: "/tiara-materials/d9dbfba7-fa55-4aa9-9281-908381b4296e 1.png",
  },
];

function FabricSelector() {
  const { selectedMaterial, setSelectedMaterial } = useTiaraContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto !border-t-0 py-2 no-scrollbar">
      {materials.map((material, index) => (
        <button
          key={material.name}
          type="button"
          className={clsx(
            "inline-flex items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80 shrink-0",
            {
              "selectedShape-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                selectedMaterial === material.name,
            },
          )}
          onClick={() => setSelectedMaterial(material.name)}
        >
          <img
            src={material.image}
            alt={material.name}
            className="size-6 shrink-0"
          />
          <span className="text-sm">{material.name}</span>
        </button>
      ))}
    </div>
  );
}

function TiaraProductList() {
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

  const { colorFamily } = useTiaraContext();

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