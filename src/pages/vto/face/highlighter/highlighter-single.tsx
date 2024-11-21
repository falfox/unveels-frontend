import clsx from "clsx";
import { Icons } from "../../../../components/icons";
import { ColorPalette } from "../../../../components/color-palette";
import { filterTextures } from "../../../../api/attributes/texture";
import { useMakeup } from "../../../../context/makeup-context";
import { useHighlighterContext } from "./highlighter-context";
import { Product } from "../../../../api/shared";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";

export function SingleHighlighterSelector({ product }: { product: Product }) {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <ColorSelector product={product} />
      </div>
      <TextureSelector product={product} />
      <ShapeSelector />
      <ProductList product={product} />
    </div>
  );
}

function ColorSelector({ product }: { product: Product }) {
  const { selectedColor, setSelectedColor } = useHighlighterContext();
  const { setHighlighterColor, showHighlighter, setShowHighlighter } =
    useMakeup();

  const handleClearSelection = () => {
    if (showHighlighter) {
      setShowHighlighter(false);
    }
    setSelectedColor(null);
  };

  const handleColorSelection = (color: string) => {
    if (!showHighlighter) {
      setShowHighlighter(true);
    }
    setSelectedColor(color);
    setHighlighterColor(color);
  };

  const extracted_sub_colors = extractUniqueCustomAttributes(
    [product],
    "hexacode",
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

function TextureSelector({ product }: { product: Product }) {
  const { selectedTexture, setSelectedTexture } = useHighlighterContext();
  const { setHighlighterMaterial } = useMakeup();

  const productTextures = extractUniqueCustomAttributes([product], "texture");
  const textures = filterTextures(["Metallic", "Matte", "Shimmer"]);

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
        {textures.map((texture, index) => (
          <button
            key={texture.value}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
              {
                "border-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                  selectedTexture === texture.value,
              },
            )}
            onClick={() => {
              if (selectedTexture === texture.value) {
                setSelectedTexture(null);
              } else {
                setSelectedTexture(texture.value);
                setHighlighterMaterial(index);
              }
            }}
          >
            <span className="text-sm">{texture.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useHighlighterContext();
  const { setHighlighterPattern } = useMakeup();
  const highlighters = [
    "/highlighters/highlighter-1.png",
    "/highlighters/highlighter-2.png",
    "/highlighters/highlighter-3.png",
    "/highlighters/highlighter-4.png",
  ];

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto no-scrollbar">
        {highlighters.map((path, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center rounded-sm border border-transparent text-white/80",
              {
                "border-white/80": selectedShape === index.toString(),
              },
            )}
            onClick={() => {
              setSelectedShape(index.toString());
              setHighlighterPattern(index);
            }}
          >
            <img src={path} alt="Highlighter" className="size-12 rounded" />
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
