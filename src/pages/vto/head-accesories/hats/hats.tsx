import clsx from "clsx";
import { Icons } from "../../../../components/icons";


import { colors } from "../../../../api/attributes/color";
import { filterFabrics } from "../../../../api/attributes/fabric";
import { filterOccasions } from "../../../../api/attributes/occasion";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { HatsProvider, useHatsContext } from "./hats-context";
import { useHatsQuery } from "./hats-query";

export function HatsSelector() {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <FamilyColorSelector />
      <ColorSelector />
      <ModeSelector />
      <ProductList />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useHatsContext();

  return (
    <div className="flex items-center w-full py-2 space-x-2 overflow-x-auto no-scrollbar">
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
  const { colorFamily, selectedColor, setSelectedColor } = useHatsContext();
  const { data } = useHatsQuery({
    color: colorFamily,
    fabric: null,
    occasion: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

  return (
    <div className="mx-auto w-full !border-t-0 pb-4 lg:max-w-xl">
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
        {extracted_sub_colors.map((color, index) => (
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
            onClick={() => {
              if (selectedColor === color) {
                setSelectedColor(null);
              } else {
                setSelectedColor(color);
              }
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}

function ModeSelector() {
  const { selectedMode, setSelectedMode } = useHatsContext();

  return (
    <>
      <div className="flex items-center justify-between w-full h-10 text-center">
        <button
          className={clsx("relative h-10 grow text-lg", {
            "text-white": selectedMode === "occasions",
            "text-white/60": selectedMode !== "occasions",
          })}
          onClick={() => setSelectedMode("occasions")}
        >
          Occasions
        </button>
        <div className="h-5 border-r border-white"></div>
        <button
          className={clsx("relative h-10 grow text-lg", {
            "text-white": selectedMode === "fabrics",
            "text-white/60": selectedMode !== "fabrics",
          })}
          onClick={() => setSelectedMode("fabrics")}
        >
          Fabrics
        </button>
      </div>

      {selectedMode === "occasions" ? <OccasionSelector /> : <FabricSelector />}
    </>
  );
}

const occasions = filterOccasions(["Casual", "Formal", "Sports"]);

function OccasionSelector() {
  const { selectedOccasion, setSelectedOccasion } = useHatsContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto !border-t-0 py-2 no-scrollbar">
      {occasions.map((occasion, index) => (
        <button
          key={occasion.value}
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
            {
              "selectedShape-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                selectedOccasion === occasion.value,
            },
          )}
          onClick={() => setSelectedOccasion(occasion.value)}
        >
          <span className="text-sm">{occasion.label}</span>
        </button>
      ))}
    </div>
  );
}

const fabrics = filterFabrics(["Polyester", "Cotton", "Leather", "Denim"]);

function FabricSelector() {
  const { selectedFabric, setSelectedFabric } = useHatsContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto !border-t-0 py-2 no-scrollbar">
      {fabrics.map((fabric, index) => (
        <button
          key={fabric.value}
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
            {
              "selectedShape-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                selectedFabric === fabric.value,
            },
          )}
          onClick={() => setSelectedFabric(fabric.value)}
        >
          <span className="text-sm">{fabric.label}</span>
        </button>
      ))}
    </div>
  );
}

function ProductList() {
  const { colorFamily, selectedOccasion, selectedFabric } = useHatsContext();

  const { data, isLoading } = useHatsQuery({
    color: colorFamily,
    occasion: selectedOccasion,
    fabric: selectedFabric,
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
