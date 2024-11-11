import { Product } from "../../api/shared";
import { getProductAttributes, mediaUrl } from "../../utils/apiUtils";
import { BrandName } from "../product/brand";

export function VTOProductCard({ product }: { product: Product }) {
  const imageUrl = mediaUrl(product.media_gallery_entries?.[0]?.file);

  return (
    <div className="w-[100px] rounded shadow">
      <div className="relative h-[70px] w-[100px] overflow-hidden">
        <img src={imageUrl} alt="Product" className="object-cover rounded" />
      </div>

      <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
        {product.name}
      </h3>
      <p className="text-[0.625rem] text-white/60">
        <BrandName brandId={getProductAttributes(product, "brand")} />
      </p>
      <div className="flex items-end justify-between pt-1 space-x-1">
        <div className="bg-gradient-to-r from-[#CA9C43] to-[#92702D] bg-clip-text text-[0.625rem] text-transparent">
          ${product.price}
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
}
