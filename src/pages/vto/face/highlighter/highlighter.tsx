import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";

import {
  HighlighterProvider,
  useHighlighterContext,
} from "./highlighter-context";
import { useMakeup } from "../../../../context/makeup-context";
import { useQuery } from "@tanstack/react-query";
import { faceMakeupProductTypesFilter } from "../../../../api/attributes/makeups";
import {
  baseUrl,
  buildSearchParams,
  extractUniqueCustomAttributes,
  getProductAttributes,
  mediaUrl,
} from "../../../../utils/apiUtils";
import { defaultHeaders, Product } from "../../../../api/shared";
import { BrandName } from "../../../../components/product/brand";
import { LoadingProducts } from "../../../../components/loading";
import { filterTextures } from "../../../../api/attributes/texture";
import { useFaceHighlighterQuery } from "./highlighter-query";

export function HighlighterSelector() {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <ColorSelector />

      <TextureSelector />

      <ShapeSelector />

      <ProductList />
    </div>
  );
}

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useHighlighterContext();
  const {
    highlighterColor,
    setHighlighterColor,
    showHighlighter,
    setShowHighlighter,
  } = useMakeup();

  const { data, isLoading } = useFaceHighlighterQuery({
    color: null,
    texture: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((color) => color.split(","));

  function reset() {
    if (showHighlighter) {
      setShowHighlighter(false);
    }

    setSelectedColor(null);
  }

  function setColor(color: string) {
    if (!showHighlighter) {
      setShowHighlighter(true);
    }

    setHighlighterColor(color);
    setSelectedColor(color);
  }

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80"
          onClick={() => {
            reset();
          }}
        >
          <Icons.empty className="size-10" />
        </button>
        {extracted_sub_colors.map((color, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setSelectedColor(color)}
          >
            <ColorPalette
              key={index}
              size="large"
              palette={{
                color: color,
              }}
              selected={selectedColor === color}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const textures = filterTextures(["Metallic", "Matte", "Shimmer"]);

function TextureSelector() {
  const { selectedTexture, setSelectedTexture } = useHighlighterContext();
  const { highlighterMaterial, setHighlighterMaterial } = useMakeup();

  function setMaterial(
    material: number,
    texture: { label: string; value: string },
  ) {
    if (selectedTexture === texture.value) {
      setSelectedTexture(null);
    } else {
      setSelectedTexture(texture.value);
    }
    setHighlighterMaterial(material);
  }

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
            onClick={() => setMaterial(index, texture)}
          >
            <span className="text-sm">{texture.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const highlighters = [
  "/highlighters/highlighter-1.png",
  "/highlighters/highlighter-2.png",
  "/highlighters/highlighter-3.png",
  "/highlighters/highlighter-4.png",
];

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useHighlighterContext();
  const { setHighlighterPattern } = useMakeup();

  function setPattern(pattern: number, patternName: string) {
    setSelectedShape(patternName);
    setHighlighterPattern(pattern);
  }

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
            onClick={() => setPattern(index, index.toString())}
          >
            <img src={path} alt="Highlighter" className="size-12 rounded" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductList() {
  const { selectedTexture, selectedColor } = useHighlighterContext();

  const { data, isLoading } = useFaceHighlighterQuery({
    color: selectedColor,
    texture: selectedTexture,
  });

  const products = [
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Double Wear Stay-in-Place Foundation",
      brand: "Estée Lauder",
      price: 52,
      originalPrice: 60,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
  ];

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
      {isLoading ? (
        <LoadingProducts />
      ) : (
        data?.items.map((product, index) => {
          const imageUrl =
            mediaUrl(product.media_gallery_entries[0].file) ??
            "https://picsum.photos/id/237/200/300";

          return (
            <div key={index} className="w-[100px] rounded shadow">
              <div className="relative h-[70px] w-[100px] overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Product"
                  className="rounded object-cover"
                />
              </div>

              <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
                {product.name}
              </h3>
              <p className="text-[0.625rem] text-white/60">
                <BrandName brandId={getProductAttributes(product, "brand")} />{" "}
              </p>
              <div className="flex items-end justify-between space-x-1 pt-1">
                <div className="bg-gradient-to-r from-[#CA9C43] to-[#92702D] bg-clip-text text-[0.625rem] text-transparent">
                  $15
                </div>
                <button
                  type="button"
                  className="flex h-7 items-center justify-center bg-gradient-to-r from-[#CA9C43] to-[#92702D] px-2.5 text-[0.5rem] font-semibold text-white"
                >
                  Add to cart
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
