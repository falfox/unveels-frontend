import clsx from "clsx";
import { colors } from "../api/attributes/color";
import { Icons } from "../components/icons";
import { ColorPalette } from "../components/color-palette";
import { useState } from "react";
import { textures } from "../api/attributes/texture";
import { LoadingProducts } from "../components/loading";
import { getProductAttributes, mediaUrl } from "../utils/apiUtils";
import { BrandName } from "../components/product/brand";
import { Link, useParams } from "react-router-dom";
import data from "../assets/message.json";

export function SingleVirtualTryOnDetail() {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <ColorSelector />
      </div>

      <TextureSelector />

      {/* <ShadesSelector />*/}

      <ProductList />
    </div>
  );
}

const sub_color = [
  "#E0467C",
  "#740039",
  "#8D0046",
  "#B20058",
  "#B51F69",
  "#DF1050",
  "#E31B7B",
  "#E861A4",
  "#FE3699",
];

function ColorSelector() {
  const handleColorClick = () => {};

  const handleClearSelection = () => {};

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
        {sub_color.map((color, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handleColorClick()}
            className={clsx("cursor-pointer")}
          >
            <ColorPalette size="large" palette={{ color }} />
          </button>
        ))}
      </div>
      {/* Removed the error message since all buttons are enabled */}
    </div>
  );
}

function TextureSelector() {
  const { sku } = useParams();
  const productConfigurable = data.items.filter((i) => i.sku === sku);
  const textureAttribute = productConfigurable[0].custom_attributes.find(
    (i) => i.attribute_code === "texture",
  );
  const textureProducts = textures.filter(
    (i) => i.value === textureAttribute?.value,
  );

  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
        {textureProducts.map((texture, index) => (
          <button
            key={texture.label}
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

function ProductList() {
  const [isLoading, setIsloading] = useState(false);
  const { sku } = useParams();
  const productConfigurable = data.items.filter((i) => i.sku === sku);
  const productSimples = data.items.filter((i) =>
    productConfigurable[0].extension_attributes.configurable_product_links?.includes(
      i.id,
    ),
  );

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
      {isLoading ? (
        <LoadingProducts />
      ) : (
        productSimples.map((product, index) => {
          const imageUrl =
            // mediaUrl(product.media_gallery_entries[0].file) ??
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
                {/* <BrandName brandId={getProductAttributes(product, "brand")} />{" "} */}
                Brand
              </p>
              <div className="flex items-end justify-between space-x-1 pt-1">
                <div className="bg-gradient-to-r from-[#CA9C43] to-[#92702D] bg-clip-text text-[0.625rem] text-transparent">
                  {product.price}
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
