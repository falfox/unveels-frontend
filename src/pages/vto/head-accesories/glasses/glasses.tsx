import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { colors } from "../../../../api/attributes/color";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { GlassesProvider, useGlassesContext } from "./glasses-context";
import { useGlassesQuery } from "./glasses-query";
import { filterShapes } from "../../../../api/attributes/shape";
import { filterMaterials } from "../../../../api/attributes/material";

export function GlassesSelector() {
  return (
      <div className="w-full px-4 mx-auto divide-y">
        <FamilyColorSelector />

        <ColorSelector />

        <ModeSelector />

        <ProductList />
      </div>
  );
}

function ModeSelector() {
  const { selectedMode, setSelectedMode } = useGlassesContext();

  return (
    <>
      <div className="flex items-center justify-between w-full h-10 text-center">
        <button
          className={clsx("relative grow text-base", {
            "text-white": selectedMode === "shapes",
            "text-white/60": selectedMode !== "shapes",
          })}
          onClick={() => setSelectedMode("shapes")}
        >
          Shapes
        </button>
        <div className="h-5 border-r border-white"></div>
        <button
          className={clsx("relative grow text-base", {
            "text-white": selectedMode === "material",
            "text-white/60": selectedMode !== "material",
          })}
          onClick={() => setSelectedMode("material")}
        >
          Material
        </button>
      </div>

      {selectedMode === "shapes" ? <ShapeSelector /> : <MaterialSelector />}
    </>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useGlassesContext();

  return (
    <div
      className="flex items-center w-full py-2 space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {colors.map((item, index) => (
        <button
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-2 py-1 text-white/80 h-5",
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
          <span className="text-[0.625rem]">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function ColorSelector() {
  const { colorFamily, selectedColor, setSelectedColor } = useGlassesContext();

  const { data } = useGlassesQuery({
    color: colorFamily,
    material: null,
    shape: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

  return (
    <div className="w-full py-4 mx-auto">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex items-center border border-transparent rounded-full size-10 shrink-0 gap-x-2 text-white/80"
          onClick={() => {
            setSelectedColor(null);
          }}
        >
          <Icons.empty className="size-[1.875rem]" />
        </button>
        {extracted_sub_colors.map((color, index) => (
          <button
            key={color}
            type="button"
            className={clsx(
              "inline-flex size-[1.875rem] shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80",
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

const shapes = filterShapes([
  "Square",
  "Clubmaster",
  "Rectangular",
  "Tortoise",
  "Octagonal",
  "Clipon",
  "Aviator",
  "Oversized",
  "Cat Eye",
  "Navigator",
  "Round ",
  "Wayfarer",
  "Triangle",
  "Shield",
]);

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useGlassesContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto !border-t-0 py-2 no-scrollbar">
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
          <span className="text-sm">{shape.label}</span>
        </button>
      ))}
    </div>
  );
}

const materials = filterMaterials(["Metal", "Plastic"]);

function MaterialSelector() {
  const { selectedMaterial, setSelectedMaterial } = useGlassesContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto !border-t-0 py-2 no-scrollbar">
      {materials.map((material, index) => (
        <button
          key={material.value}
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
            {
              "selectedShape-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                selectedMaterial === material.value,
            },
          )}
          onClick={() => setSelectedMaterial(material.value)}
        >
          <span className="text-sm">{material.label}</span>
        </button>
      ))}
    </div>
  );
}

function ProductList() {
  const { colorFamily, selectedMaterial, selectedShape } = useGlassesContext();

  const { data, isLoading } = useGlassesQuery({
    color: colorFamily,
    shape: selectedShape,
    material: selectedMaterial,
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
