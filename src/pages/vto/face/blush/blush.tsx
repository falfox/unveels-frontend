import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import { BlushProvider, useBlushContext } from "./blush-context";

export function BlushSelector() {
  return (
    <BlushProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <ColorSelector />

        <TextureSelector />

        <ShapeSelector />

        <ProductList />
      </div>
    </BlushProvider>
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
  const { selectedColor, setSelectedColor } = useBlushContext();
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
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

const textures = ["Metallic", "Matt", "Shimmer"];

function TextureSelector() {
  const { selectedTexture, setSelectedTexture } = useBlushContext();
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        {textures.map((texture, index) => (
          <button
            key={texture}
            type="button"
            className={clsx(
              "inline-flex items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80 shrink-0",
              {
                "border-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                  selectedTexture === texture,
              },
            )}
            onClick={() => setSelectedTexture(texture)}
          >
            <span className="text-sm">{texture}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const blushes = [
  "/blushes/blusher-1.png",
  "/blushes/blusher-2.png",
  "/blushes/blusher-3.png",
  "/blushes/blusher-4.png",
  "/blushes/blusher-5.png",
];

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useBlushContext();
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        {blushes.map((path, index) => (
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