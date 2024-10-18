import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { LashesProvider, useLashesContext } from "./lashes-context";
import { ColorPalette } from "../../../../components/color-palette";
import { Link } from "react-router-dom";

const colorFamilies = [{ name: "Black", value: "#000000" }];

export function LashesSelector() {
  return (
    <LashesProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <FamilyColorSelector />

        <ColorSelector />

        <div className="flex items-center justify-between w-full h-10 text-center">
          <Link className={`relative h-10 grow text-lg`} to="/virtual-try-on/lashes">
            <span className={"text-white"}>Lashes</span>
          </Link>
          <div className="h-5 border-r border-white"></div>
          <Link className={`relative h-10 grow text-lg`} to="/virtual-try-on/mascara">
            <span className={"text-white/60"}>Mascara</span>
          </Link>
        </div>

        <ShapeSelector />

        <ProductList />
      </div>
    </LashesProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useLashesContext();

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

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useLashesContext();
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
        {["#000000"].map((color, index) => (
          <button type="button" key={index}>
            <ColorPalette
              key={index}
              size="large"
              palette={{
                color: color,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const eyelashes = [
  "/eyelashesh/eyelashes-1.png",
  "/eyelashesh/eyelashes-2.png",
  "/eyelashesh/eyelashes-3.png",
  "/eyelashesh/eyelashes-4.png",
  "/eyelashesh/eyelashes-5.png",
  "/eyelashesh/eyelashes-6.png",
  "/eyelashesh/eyelashes-7.png",
  "/eyelashesh/eyelashes-8.png",
  "/eyelashesh/eyelashes-9.png",
];

function ShapeSelector() {
  const { selectedColor, setSelectedColor } = useLashesContext();
  return (
    <div className="mx-auto w-full !border-t-0 pt-4 lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        {eyelashes.map((path, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center rounded-sm border border-transparent text-white/80",
              {
                "border-white/80": selectedColor === index.toString(),
              },
            )}
            onClick={() => setSelectedColor(index.toString())}
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

  const { colorFamily } = useLashesContext();

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
