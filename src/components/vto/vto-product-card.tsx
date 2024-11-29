import { Product } from "../../api/shared";
import { getProductAttributes, mediaUrl } from "../../utils/apiUtils";
import { BrandName } from "../product/brand";

export function VTOProductCard({ product }: { product: Product }) {
  const imageUrl = mediaUrl(product.media_gallery_entries?.[0]?.file);

  return (
    <div className="w-[70px] sm:w-[100px] shadow">
      <div className="relative w-[70px] h-[47.6px] sm:h-[70px] sm:w-[100px] overflow-hidden">
        <img src={imageUrl} alt="Product" className="rounded object-cover" />
      </div>

      <h3 className="line-clamp-2 h-6 sm:h-10 py-1 sm:py-2 text-[0.425rem] sm:text-[0.625rem] font-semibold text-white">
        {product.name}
      </h3>
      <p className="text-[0.425rem] sm:text-[0.625rem] h-3 sm:h-4 text-white/60">
        <BrandName brandId={getProductAttributes(product, "brand")} />
      </p>
      <div className="flex items-end justify-between space-x-1 pt-1">
        <div className="bg-gradient-to-r from-[#CA9C43] to-[#92702D] bg-clip-text text-[0.4375rem] sm:text-[0.625rem] text-transparent">
          ${product.price}
        </div>
        <button
          type="button"
          className="flex sm:h-7 items-center justify-center bg-gradient-to-r from-[#CA9C43] to-[#92702D] px-0.5 sm:px-1.5 h-4 text-[0.4rem] sm:text-[0.625rem] font-semibold text-white"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
