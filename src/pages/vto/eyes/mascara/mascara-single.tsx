import clsx from "clsx";
import { colors } from "../../../../api/attributes/color";
import { Product } from "../../../../api/shared";
import { ColorPalette } from "../../../../components/color-palette";
import { Icons } from "../../../../components/icons";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { useMascaraContext } from "./mascara-context";

export function SingleMascaraSelector({ product }: { product: Product }) {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <FamilyColorSelector />
        <ColorSelector product={product} />
      </div>

      <ProductList product={product} />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useMascaraContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
      {colors.map((item) => (
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
  const { selectedColor, setSelectedColor } = useMascaraContext();
  // const { setMascaraColor, showMascara, setShowMascara } = useMakeup();

  const handleClearSelection = () => {
    // if (showMascara) {
    //   setShowMascara(false);
    // }
    setSelectedColor(null);
  };

  const handleColorSelection = (color: string) => {
    // if (!showMascara) {
    //   setShowMascara(true);
    // }
    setSelectedColor(color);
    // setMascaraColor(color);
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
          >
            <ColorPalette
              size="large"
              palette={{ color }}
              selected={selectedColor === color}
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
        <VTOProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}
