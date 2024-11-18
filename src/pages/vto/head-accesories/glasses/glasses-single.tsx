import clsx from "clsx";
import { Icons } from "../../../../components/icons";
import { colors } from "../../../../api/attributes/color";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { useGlassesContext } from "./glasses-context";
import {
  filterShapes,
  filterShapesByValue,
} from "../../../../api/attributes/shape";
import { filterMaterials } from "../../../../api/attributes/material";
import { Product } from "../../../../api/shared";

export function SingleGlassesSelector({ product }: { product: Product }) {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <FamilyColorSelector />
        <ColorSelector product={product} />
      </div>
      <ModeSelector product={product} />
      <ProductList product={product} />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useGlassesContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto py-2 no-scrollbar">
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
  const { selectedColor, setSelectedColor } = useGlassesContext();

  const handleClearSelection = () => {
    setSelectedColor(null);
  };

  const handleColorSelection = (color: string) => {
    if (selectedColor === color) {
      setSelectedColor(null);
    } else {
      setSelectedColor(color);
    }
  };

  const extracted_sub_colors = extractUniqueCustomAttributes(
    [product],
    "hexacode",
  ).flatMap((item) => item.split(","));

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

function ModeSelector({ product }: { product: Product }) {
  const { selectedMode, setSelectedMode } = useGlassesContext();

  return (
    <>
      <div className="flex h-10 w-full items-center justify-between text-center">
        <button
          className={clsx("relative h-10 grow text-lg", {
            "text-white": selectedMode === "shapes",
            "text-white/60": selectedMode !== "shapes",
          })}
          onClick={() => setSelectedMode("shapes")}
        >
          Shapes
        </button>
        <div className="h-5 border-r border-white"></div>
        <button
          className={clsx("relative h-10 grow text-lg", {
            "text-white": selectedMode === "material",
            "text-white/60": selectedMode !== "material",
          })}
          onClick={() => setSelectedMode("material")}
        >
          Material
        </button>
      </div>

      {selectedMode === "shapes" ? (
        <ShapeSelector product={product} />
      ) : (
        <MaterialSelector product={product} />
      )}
    </>
  );
}

function ShapeSelector({ product }: { product: Product }) {
  const { selectedShape, setSelectedShape } = useGlassesContext();
  const productShapes = extractUniqueCustomAttributes([product], "shape");
  const shapes = filterShapesByValue(productShapes);

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto py-2 no-scrollbar">
      {shapes.map((shape) => (
        <button
          key={shape.value}
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
            {
              "bg-gradient-to-r from-[#CA9C43] to-[#473209]":
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

function MaterialSelector({ product }: { product: Product }) {
  const { selectedMaterial, setSelectedMaterial } = useGlassesContext();

  const productMaterials = extractUniqueCustomAttributes([product], "material");
  const materials = filterMaterials(productMaterials);

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto py-2 no-scrollbar">
      {materials.map((material) => (
        <button
          key={material.value}
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
            {
              "bg-gradient-to-r from-[#CA9C43] to-[#473209]":
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

function ProductList({ product }: { product: Product }) {
  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
      {[product].map((item) => (
        <VTOProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}
