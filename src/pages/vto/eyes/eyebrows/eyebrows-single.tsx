import clsx from "clsx";
import { Icons } from "../../../../components/icons";
import { useEyebrowsContext } from "./eyebrows-context";
import { useMakeup } from "../../../../context/makeup-context";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { filterColors } from "../../../../api/attributes/color";
import { Product } from "../../../../api/shared";

const colorFamilies = filterColors(["Brown", "Black"]);

export function SingleEyebrowsSelector({ product }: { product: Product }) {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <FamilyColorSelector />
        <ColorSelector product={product} />
      </div>
      <PatternSelector />
      <BrightnessSlider />
      <ProductList product={product} />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useEyebrowsContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
      {colorFamilies.map((item) => (
        <button
          key={item.value}
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
            style={{ background: item.hex }}
          />
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function ColorSelector({ product }: { product: Product }) {
  const { selectedColor, setSelectedColor } = useEyebrowsContext();
  const { setEyebrowsColor, showEyebrows, setShowEyebrows } = useMakeup();

  const handleClearSelection = () => {
    if (showEyebrows) {
      setShowEyebrows(false);
    }
    setSelectedColor(null);
  };

  const handleColorSelection = (color: string) => {
    if (!showEyebrows) {
      setShowEyebrows(true);
    }
    setSelectedColor(color);
    setEyebrowsColor(color);
  };

  const extracted_sub_colors = extractUniqueCustomAttributes(
    [product],
    "hexacode",
  ).flatMap((color) => color.split(","));

  return (
    <div className="mx-auto w-full py-2 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80"
          onClick={handleClearSelection}
        >
          <Icons.empty className="size-10" />
        </button>
        {extracted_sub_colors.map((color, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80",
              {
                "border-white/80": selectedColor === color,
              },
            )}
            style={{ background: color }}
            onClick={() => handleColorSelection(color)}
          />
        ))}
      </div>
    </div>
  );
}

function PatternSelector() {
  const { selectedPattern, setSelectedPattern } = useEyebrowsContext();
  const { setEyebrowsPattern } = useMakeup();

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
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
            onClick={() => {
              setSelectedPattern(index.toString());
              setEyebrowsPattern(index);
            }}
          >
            <img
              src={`/eyebrows/${index % 8}.png`}
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
        onChange={(e) =>
          setEyebrowsVisibility(parseFloat(e.currentTarget.value))
        }
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

function ProductList({ product }: { product: Product }) {
  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
      {[product].map((item) => (
        <VTOProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}
