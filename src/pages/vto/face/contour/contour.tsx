import clsx from "clsx";
import { Icons } from "../../../../components/icons";
import { ColorPalette } from "../../../../components/color-palette";
import { ContourProvider, useContourContext } from "./contour-context";
import { useRef } from "react";
import { useMakeup } from "../../../../context/makeup-context";

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

export function ContourSelector() {
  return (
    <ContourProvider>
      <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
        <ColorSelector />
        <ModeSelector />
        <ShapeSelector />
        <ProductList />
      </div>
    </ContourProvider>
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
  const replaceIndexRef = useRef(0); // To track which color to replace next

  const handleColorClick = (color: string) => {
    if (!showContour) {
      setShowContour(true);
    }
    if (selectedColors.includes(color)) {
      // Deselect the color if it's already selected
      setSelectedColors(selectedColors.filter((c) => c !== color));
      setContourColors(selectedColors.filter((c) => c !== color));
    } else if (selectedMode === "One") {
      setContourMode("One");
      // In "One" mode, only one color can be selected
      setSelectedColors([color]);
      setContourColors([color]);
    } else if (selectedMode === "Dual") {
      setContourMode("Dual");
      if (selectedColors.length < 2) {
        // Add the color if less than two are selected
        setSelectedColors([...selectedColors, color]);
        setContourColors([...selectedColors, color]);
      } else {
        // Replace the color based on replaceIndexRef
        const newSelectedColors = [...selectedColors];
        newSelectedColors[replaceIndexRef.current] = color;
        setSelectedColors(newSelectedColors);
        setContourColors(newSelectedColors);
        // Update replaceIndexRef to alternate between 0 and 1
        replaceIndexRef.current = (replaceIndexRef.current + 1) % 2;
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedColors([]);
    replaceIndexRef.current = 0;
    setShowContour(false);
  };

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80"
          onClick={handleClearSelection}
        >
          <Icons.empty className="size-10" />
        </button>
        {colors.map((color, index) => (
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
    <div className="mx-auto w-full py-2 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
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
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto no-scrollbar">
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
            <img src={path} alt="Eyebrow" className="size-12 rounded" />
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
    // Add more products as needed
  ];

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
              ${product.price}
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
