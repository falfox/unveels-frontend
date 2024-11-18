import clsx from "clsx";
import { colors } from "../../../../api/attributes/color";
import { Icons } from "../../../../components/icons";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { useMakeup } from "../../../../context/makeup-context";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { useLipLinerContext } from "./lip-liner-context";
import { Product } from "../../../../api/shared";

export function SingleLipLinerSelector({ product }: { product: Product }) {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <ColorSelector product={product} />
      </div>

      <SizeSelector product={product} />

      <ProductList product={product} />
    </div>
  );
}

function ColorSelector({ product }: { product: Product }) {
  const { setLiplinerColor, showLipliner, setShowLipliner } = useMakeup();
  const { selectedColor, setSelectedColor } = useLipLinerContext();

  const handleColorClick = (color: string) => {
    if (!showLipliner) {
      setShowLipliner(true);
    }
    setSelectedColor(color);
    setLiplinerColor(color);
  };

  const handleClearSelection = () => {
    setSelectedColor(null);
    setShowLipliner(false);
  };

  const extracted_sub_colors = extractUniqueCustomAttributes(
    [product],
    "hexacode"
  ).flatMap((color) => color.split(","));

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
        {extracted_sub_colors.map((color, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handleColorClick(color)}
            className={clsx(
              "inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80",
              {
                "border-white/80": selectedColor === color,
              }
            )}
            style={{ background: color }}
          />
        ))}
      </div>
    </div>
  );
}

const lipLinerSizes = [
  "Small",
  "Upper Lip", 
  "Large Lower",
  "Large Narrower",
  "Large & Full",
  "Wider"
];

function SizeSelector({ product }: { product: Product }) {
  const { selectedSize, setSelectedSize } = useLipLinerContext();
  const { setLiplinerPattern } = useMakeup();

  const handleSizeClick = (index: number, size: string) => {
    setLiplinerPattern(index);
    setSelectedSize(size);
  };

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
        {lipLinerSizes.map((size, index) => (
          <button
            key={size}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
              {
                "border-white/80": selectedSize === size,
              }
            )}
            onClick={() => handleSizeClick(index, size)}
          >
            <img
              src={`/lipliners/lipliner ${size.toLowerCase()}.png`}
              alt={size}
              className="size-12"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductList({ product }: { product: Product }) {
  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
      {[product].map((item) => (
        <VTOProductCard product={item} key={item.id} />
      ))}
    </div>
  );
}