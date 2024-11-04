import clsx from "clsx";
import { Icons } from "../../../../components/icons";
import { EyebrowsProvider, useEyebrowsContext } from "./eyebrows-context";
import { useMakeup } from "../../../../context/makeup-context";
import { events } from "@react-three/fiber";

const colorFamilies = [
  { name: "Brown", value: "#3D0B0B" },
  { name: "Black", value: "#000000" },
];

export function EyebrowsSelector() {
  return (
    <EyebrowsProvider>
      <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
        <div>
          <FamilyColorSelector />

          <ColorSelector />
        </div>

        <ShapeSelector />

        <BrightnessSlider />

        <ProductList />
      </div>
    </EyebrowsProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useEyebrowsContext();
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
  const { selectedColor, setSelectedColor } = useEyebrowsContext();
  const { setEyebrowsColor, showEyebrows, setShowEyebrows } = useMakeup();

  function reset() {
    if (showEyebrows) {
      setShowEyebrows(false);
    }
    setSelectedColor(null);
  }

  function setColor(color: string) {
    if (!showEyebrows) {
      setShowEyebrows(true);
    }
    setSelectedColor(color);
    setEyebrowsColor(color);
  }

  return (
    <div className="mx-auto w-full py-2 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80"
          onClick={() => {
            reset();
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

function ShapeSelector() {
  const { selectedShape: selectedSize, setSelectedShape: setSelectedSize } =
    useEyebrowsContext();
  const { setEyebrowsPattern } = useMakeup();

  function setPattern(pattern: number, patternName: string) {
    setSelectedSize(patternName);
    setEyebrowsPattern(pattern);
  }
  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
        {[...Array(8)].map((_, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80",
              {
                "border-white/80": selectedSize === index.toString(),
              },
            )}
            onClick={() => setPattern(index, index.toString())}
          >
            <img
              src={`/eyebrows/${index}.png`}
              alt="Eyebrow"
              className="h-5 w-14 rounded"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function BrightnessSlider() {
  const { setEyebrowsVisibility, eyebrowsVisibility } = useMakeup();
  return (
    <div className="pb-2 pt-4">
      <input
        id="minmax-range"
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        className="h-1 w-full cursor-pointer rounded-lg bg-gray-200 accent-[#CA9C43]"
        onChange={(e) => {
          setEyebrowsVisibility(parseFloat(e.currentTarget.value));
        }}
        value={eyebrowsVisibility}
      />
      <div className="flex justify-between text-[0.5rem]">
        <label htmlFor="minmax-range" className="text-white/80">
          Light
        </label>
        <label htmlFor="minmax-range" className="text-white/80">
          Dark
        </label>
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

  const { colorFamily, selectedShape } = useEyebrowsContext();

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
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
