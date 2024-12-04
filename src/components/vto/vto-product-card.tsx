import { Product } from "../../api/shared";
import { getProductAttributes, mediaUrl } from "../../utils/apiUtils";
import { BrandName } from "../product/brand";

export function VTOProductCard({ product }: { product: Product }) {
  const imageUrl = mediaUrl(product.media_gallery_entries?.[0]?.file);

  return (
    <div className="w-[70px] shadow sm:w-[100px]">
      <div className="relative h-[47.6px] w-[70px] overflow-hidden sm:h-[70px] sm:w-[100px]">
        <img src={imageUrl} alt="Product" className="rounded object-cover" />
      </div>

      <h3 className="line-clamp-2 h-6 py-1 text-[0.425rem] font-semibold text-white sm:h-10 sm:py-2 sm:text-[0.625rem]">
        {product.name}
      </h3>
      <p className="h-3 text-[0.425rem] text-white/60 sm:h-4 sm:text-[0.625rem]">
        <BrandName brandId={getProductAttributes(product, "brand")} />
      </p>
      <div className="flex items-end justify-between space-x-1 pt-1">
        <div className="bg-gradient-to-r from-[#CA9C43] to-[#92702D] bg-clip-text text-[0.4375rem] text-transparent sm:text-[0.625rem]">
          ${product.price}
        </div>
        <button
          type="button"
          className="flex h-4 items-center justify-center bg-gradient-to-r from-[#CA9C43] to-[#92702D] px-0.5 text-[0.4rem] font-semibold text-white sm:h-7 sm:px-1.5 sm:text-[0.625rem]"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
