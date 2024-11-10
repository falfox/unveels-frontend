import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import { ConcealerProvider, useConcealerContext } from "./concealer-context";
import { useMakeup } from "../../../../components/three/makeup-context";
import { skin_tones } from "../../../../api/attributes/skin_tone";
import { useConcealerQuery } from "./concealer-query";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { useFoundationContext } from "../foundation/foundation-context";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";

const colorFamilies = [
  { name: "Light Skin", value: "#FAD4B4" },
  { name: "Medium Skin", value: "#D18B59" },
  { name: "Dark Skin", value: "#4B2F1B" },
];

export function ConcealerSelector() {
  return (
    <ConcealerProvider>
      <div className="w-full px-4 mx-auto lg:max-w-xl">
        <FamilyColorSelector />

        <ColorSelector />

        <ProductList />
      </div>
    </ConcealerProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useConcealerContext();

  return (
    <div
      className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {skin_tones.map((item, index) => (
        <button
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
            {
              "border-white/80": colorFamily === item.id,
            },
          )}
          onClick={() => setColorFamily(item.id)}
        >
          <div
            className="size-2.5 shrink-0 rounded-full"
            style={{
              background: item.color,
            }}
          />
          <span className="text-sm">{item.name}</span>
        </button>
      ))}
    </div>
  );
}

function ColorSelector() {
  const { colorFamily, selectedColor, setSelectedColor } =
    useConcealerContext();
  const { setConcealerColor, setShowConcealer, showConcealer } = useMakeup();

  const { data } = useConcealerQuery({
    skin_tone: colorFamily,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

  function reset() {
    if (showConcealer) {
      setShowConcealer(false);
    }
    setSelectedColor(null);
  }

  function setColor(color: string) {
    if (!showConcealer) {
      setShowConcealer(true);
    }
    setSelectedColor(color);
    setConcealerColor(color);
  }

  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
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
              <button type="button" key={index} onClick={() => setColor(color)}>
                <ColorPalette
                  key={index}
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
  const { colorFamily } = useConcealerContext();

  const { data, isLoading } = useConcealerQuery({
    skin_tone: colorFamily,
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
