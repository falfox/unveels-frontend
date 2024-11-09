import clsx from "clsx";
import { colors } from "../../../../api/attributes/color";
import { Icons } from "../../../../components/icons";
import { LoadingProducts } from "../../../../components/loading";
import { useMakeup } from "../../../../components/three/makeup-context";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { useLipLinerContext } from "./lip-liner-context";
import { useLipLinerQuery } from "./lip-liner-query";

export function LipLinerSelector() {
  return (
    <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
      <div>
        <FamilyColorSelector />

        <ColorSelector />
      </div>

      <SizeSelector />

      <ProductList />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useLipLinerContext();
  return (
    <div
      className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {colors.map((item, index) => (
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
  const { colorFamily, selectedColor, setSelectedColor } = useLipLinerContext();
  const { setLiplinerColor, showLipliner, setShowLipliner } = useMakeup();

  const { data } = useLipLinerQuery({
    color: colorFamily,
    sub_color: null,
    texture: null,
  });

  function resetColor() {
    if (showLipliner) {
      setShowLipliner(false);
    }

    setSelectedColor(null);
  }

  function setColor(color: string) {
    if (!showLipliner) {
      setShowLipliner(true);
    }

    setSelectedColor(color);
    setLiplinerColor(color);
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
            resetColor();
          }}
        >
          <Icons.empty className="size-10" />
        </button>

        {data
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

// Todo: Update the sizes to match the actual sizes
const lipLinerSizes = [
  "Small",
  "Upper Lip",
  "Large Lower",
  "Large Narrower",
  "Large & Full",
  "Wider",
];

function SizeSelector() {
  const { selectedSize, setSelectedSize } = useLipLinerContext();
  const { liplinerPattern, setLiplinerPattern } = useMakeup();

  function setPattern(pattern: number, patternName: string) {
    setLiplinerPattern(pattern);
    setSelectedSize(patternName);
  }

  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
        {lipLinerSizes.map((size, index) => (
          <button
            key={size}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
              {
                "border-white/80": selectedSize === size,
              },
            )}
            onClick={() => setPattern(index, size)}
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

function ProductList() {
  const { colorFamily, selectedSize: selectedShade } = useLipLinerContext();

  const { data, isLoading } = useLipLinerQuery({
    color: colorFamily,
    sub_color: null,
    texture: null,
  });

  return (
    <div className="flex w-full gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {isLoading ? (
        <LoadingProducts />
      ) : (
        data?.items.map((product, index) => {
          return <VTOProductCard key={product.id} product={product} />;
        })
      )}
    </div>
  );
}
