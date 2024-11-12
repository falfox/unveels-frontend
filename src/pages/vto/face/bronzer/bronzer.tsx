import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import { BronzerProvider, useBronzerContext } from "./bronzer-context";
import { useLashesContext } from "../../eyes/lashes/lashes-context";
import { useMakeup } from "../../../../context/makeup-context";
import { useQuery } from "@tanstack/react-query";
import { faceMakeupProductTypesFilter } from "../../../../api/attributes/makeups";
import {
  buildSearchParams,
  extractUniqueCustomAttributes,
  getProductAttributes,
  mediaUrl,
} from "../../../../utils/apiUtils";
import { defaultHeaders, Product } from "../../../../api/shared";
import { filterTextures } from "../../../../api/attributes/texture";
import { BrandName } from "../../../../components/product/brand";
import { LoadingProducts } from "../../../../components/loading";
import { useBronzerQuery } from "./bronzer-query";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";

const colorFamilies = [
  { name: "Light Skin", value: "#FAD4B4" },
  { name: "Medium Skin", value: "#D18B59" },
  { name: "Dark Skin", value: "#4B2F1B" },
];

function useFaceBronzerQuery({
  texture,
  color,
}: {
  texture: string | null;
  color: string | null;
}) {
  return useQuery({
    queryKey: ["products", "facebronzer", color, texture],
    queryFn: async () => {
      const filters = [
        {
          filters: [
            {
              field: "type_id",
              value: "simple",
              condition_type: "eq",
            },
          ],
        },
        {
          filters: [
            {
              field: "face_makeup_product_type",
              value: faceMakeupProductTypesFilter(["Bronzers"]),
              condition_type: "in",
            },
          ],
        },
      ];

      if (color) {
        filters.push({
          filters: [
            {
              field: "color",
              value: color,
              condition_type: "eq",
            },
          ],
        });
      }

      if (texture) {
        filters.push({
          filters: [
            {
              field: "texture",
              value: texture,
              condition_type: "eq",
            },
          ],
        });
      }

      console.log("filters", filters);

      const response = await fetch(
        "/rest/V1/products?" + buildSearchParams(filters),
        {
          headers: defaultHeaders,
        },
      );

      const results = (await response.json()) as {
        items: Array<Product>;
      };

      return results;
    },
  });
}

export function BronzerSelector() {
  return (
    <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
      <ColorSelector />

      <ShapeSelector />

      <TextureSelector />

      <ProductList />
    </div>
  );
}

const colors = [
  "#342112",
  "#3D2B1F",
  "#483C32",
  "#4A2912",
  "#4F300D",
  "#5C4033",
  "#6A4B3A",
  "#7B3F00",
  "#8B4513",
];

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useBronzerContext();
  const { setBronzerColor, showBronzer, setShowBronzer } = useMakeup();

  const { data } = useBronzerQuery({
    texture: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

  function setColor(color: string) {
    if (!showBronzer) {
      setShowBronzer(true);
    }
    setSelectedColor(color);
    setBronzerColor(color);
  }

  function reset() {
    setSelectedColor(null);
    setShowBronzer(false);
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
              <button
                type="button"
                key={index}
                onClick={() => {
                  setColor(color);
                }}
                className={clsx("cursor-pointer")}
              >
                <ColorPalette
                  size="large"
                  palette={{ color }}
                  selected={selectedColor === color}
                />
              </button>
            ))
          : null}
      </div>
    </div>
  );
}

const bronzers = [
  "/bronzers/bronzer-1.png",
  "/bronzers/bronzer-2.png",
  "/bronzers/bronzer-3.png",
  "/bronzers/bronzer-4.png",
  "/bronzers/bronzer-5.png",
];

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useBronzerContext();
  const { setBronzerPattern } = useMakeup();

  function setPattern(pattern: number, patternName: string) {
    setBronzerPattern(pattern);
    setSelectedShape(patternName);
  }

  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        {bronzers.map((path, index) => (
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
            <img src={path} alt="Eyebrow" className="rounded size-12" />
          </button>
        ))}
      </div>
    </div>
  );
}

const textures = filterTextures(["Metallic", "Matte", "Shimmer"]);

function TextureSelector() {
  const { selectedTexture, setSelectedTexture } = useBronzerContext();
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
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
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

function ProductList() {
  const { selectedTexture } = useBronzerContext();

  const { data, isLoading } = useBronzerQuery({
    texture: selectedTexture,
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
