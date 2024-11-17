import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { Link } from "react-router-dom";
import { colors } from "../../../../api/attributes/color";
import { ColorPalette } from "../../../../components/color-palette";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { MascaraProvider, useMascaraContext } from "./mascara-context";
import { useMascaraQuery } from "./mascara-query";

export function MascaraSelector() {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <FamilyColorSelector />

      <ColorSelector />

      <div className="flex h-10 w-full items-center justify-between text-center">
        <Link
          className={`relative h-10 grow text-lg`}
          to="/virtual-try-on/lashes"
        >
          <span className={"text-white/60"}>Lashes</span>
        </Link>
        <div className="h-5 border-r border-white"></div>
        <Link
          className={`relative h-10 grow text-lg`}
          to="/virtual-try-on/mascara"
        >
          <span className={"text-white"}>Mascara</span>
        </Link>
      </div>

      <ProductList />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useMascaraContext();

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

// const colors = [
//   "#FFFFFF",
//   "#342112",
//   "#3D2B1F",
//   "#483C32",
//   "#4A2912",
//   "#4F300D",
//   "#5C4033",
//   "#6A4B3A",
//   "#7B3F00",
//   "#8B4513",
// ];

function ColorSelector() {
  const { colorFamily, selectedColor, setSelectedColor } = useMascaraContext();
  const { data } = useMascaraQuery({
    color: colorFamily,
    sub_color: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

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
        {extracted_sub_colors
          ? extracted_sub_colors.map((color, index) => (
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
            ))
          : null}
      </div>
    </div>
  );
}

function ProductList() {
  const { colorFamily } = useMascaraContext();

  const { data, isLoading } = useMascaraQuery({
    color: colorFamily,
    sub_color: null,
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
