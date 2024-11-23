import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import { Link } from "react-router-dom";
import { EarringsProvider, useEarringsContext } from "./earrings-context";
import { cloneElement } from "react";
import { useGlassesQuery } from "../glasses/glasses-query";
import { useGlassesContext } from "../glasses/glasses-context";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { useEarringsQuery } from "./earrings-query";
import { filterShapes } from "../../../../api/attributes/shape";
import { colors } from "../../../../api/attributes/color";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";

export function EarringsSelector() {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <FamilyColorSelector />
      <ColorSelector />
      <ShapeSelector />
      <ProductList />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useEarringsContext();

  return (
    <div
      className="flex items-center w-full py-2 space-x-2 overflow-x-auto no-scrollbar"
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
  const { colorFamily, selectedColor, setSelectedColor } = useEarringsContext();

  const { data } = useEarringsQuery({
    color: colorFamily,
    shape: null,
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

const shapes = filterShapes(["Studs", "Cuffs", "Hoops", "Dangling"]);

const shapeIcons: { [key: string]: JSX.Element } = {
  Studs: <Icons.earringStuds />,
  Cuffs: <Icons.earringCuffs />,
  Hoops: <Icons.earringHoops />,
  Dangling: <Icons.earringDanglings />,
};

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useEarringsContext();

  return (
    <div className="flex items-center w-full py-2 space-x-2 overflow-x-auto no-scrollbar">
      {shapes.map((shape, index) => (
        <button
          key={shape.value}
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
            {
              "selectedShape-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                selectedShape === shape.value,
            },
          )}
          onClick={() => setSelectedShape(shape.value)}
        >
          {cloneElement(shapeIcons[shape.label] ?? <Icons.earringStuds />, {
            className: "size-6",
          })}
          <span className="text-sm">{shape.label}</span>
        </button>
      ))}
    </div>
  );
}

function ProductList() {
  const { colorFamily, selectedShape } = useEarringsContext();

  const { data, isLoading } = useEarringsQuery({
    color: colorFamily,
    shape: selectedShape,
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
