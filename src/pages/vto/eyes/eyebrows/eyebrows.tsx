import clsx from "clsx";
import { Icons } from "../../../../components/icons";
import { EyebrowsProvider, useEyebrowsContext } from "./eyebrows-context";
import { useMakeup } from "../../../../components/three/makeup-context";
import { events } from "@react-three/fiber";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { useEyeLinerContext } from "../eye-liners/eye-liner-context";
import { useEyebrowsQuery } from "./eyebrows-query";
import { getPatternByIndex } from "../../../../api/attributes/pattern";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { filterColors } from "../../../../api/attributes/color";

const colorFamilies = filterColors(["Brown", "Black"]);

export function EyebrowsSelector() {
  return (
    <EyebrowsProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <div>
          <FamilyColorSelector />

          <ColorSelector />
        </div>

        <PatternSelector />

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
      className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {colorFamilies.map((item, index) => (
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

function ColorSelector() {
  const { colorFamily, selectedColor, setSelectedColor } = useEyebrowsContext();
  const { setEyebrowsColor, showEyebrows, setShowEyebrows } = useMakeup();

  const { data, isLoading } = useEyebrowsQuery({
    color: colorFamily,
    pattern: null,
  });

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

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  );

  return (
    <div className="w-full py-2 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex items-center border border-transparent rounded-full size-10 shrink-0 gap-x-2 text-white/80"
          onClick={() => {
            reset();
          }}
        >
          <Icons.empty className="size-10" />
        </button>

        {extracted_sub_colors
          ? extracted_sub_colors.map((color, index) => (
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
            ))
          : null}
      </div>
    </div>
  );
}

function PatternSelector() {
  const { selectedPattern, setSelectedPattern } = useEyebrowsContext();
  const { setEyebrowsPattern } = useMakeup();

  function setPattern(pattern: number, patternName: string) {
    setSelectedPattern(patternName);
    setEyebrowsPattern(pattern);
  }
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        {[...Array(14)].map((_, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80",
              {
                "border-white/80": selectedPattern === index.toString(),
              },
            )}
            onClick={() => setPattern(index, index.toString())}
          >
            <img
              src={`/eyebrows/${index % 8}.png`}
              alt="Eyebrow"
              className="h-5 rounded w-14"
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
    <div className="pt-4 pb-2">
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
  const { colorFamily, selectedPattern } = useEyebrowsContext();

  const { data, isLoading } = useEyebrowsQuery({
    color: colorFamily,
    pattern: selectedPattern
      ? getPatternByIndex("eyebrows", parseInt(selectedPattern)).value
      : null,
  });

  return (
    <div className="flex w-full gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {isLoading ? (
        <LoadingProducts />
      ) : (
        data?.items.map((product, index) => {
          return <VTOProductCard product={product} key={product.id} />;
        })
      )}
    </div>
  );
}
