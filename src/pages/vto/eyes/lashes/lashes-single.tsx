import clsx from "clsx";
import { patterns } from "../../../../api/attributes/pattern";
import { Product } from "../../../../api/shared";
import { ColorPalette } from "../../../../components/color-palette";
import { Icons } from "../../../../components/icons";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { useLashesContext } from "./lashes-context";

export function SingleLashesSelector({ product }: { product: Product }) {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <ColorSelector />
      </div>

      <ShapeSelector />
      <ProductList product={product} />
    </div>
  );
}

const colorFamilies = [{ name: "Black", value: "#000000" }];

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useLashesContext();

  return (
    <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
      {colorFamilies.map((item) => (
        <button
          key={item.name}
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
            {
              "border-white/80": colorFamily === item.name,
            },
          )}
          onClick={() => setColorFamily(item.name)}
        >
          <div
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: item.value }}
          />
          <span className="text-sm">{item.name}</span>
        </button>
      ))}
    </div>
  );
}

function ColorSelector() {
  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80"
        >
          <Icons.empty className="size-10" />
        </button>
        {["#000000"].map((color, index) => (
          <button type="button" key={index}>
            <ColorPalette
              key={index}
              size="large"
              palette={{
                color: color,
              }}
              selected={true}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const eyelashes = [
  "/eyelashesh/eyelashes-1.png",
  "/eyelashesh/eyelashes-2.png",
  "/eyelashesh/eyelashes-3.png",
  "/eyelashesh/eyelashes-4.png",
  "/eyelashesh/eyelashes-5.png",
  "/eyelashesh/eyelashes-6.png",
  "/eyelashesh/eyelashes-7.png",
  "/eyelashesh/eyelashes-8.png",
  "/eyelashesh/eyelashes-9.png",
];

function ShapeSelector() {
  const { selectedPattern, setSelectedPattern } = useLashesContext();
  // const { setLashesPattern } = useMakeup();

  return (
    <div className="mx-auto w-full !border-t-0 pb-2 pt-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto no-scrollbar">
        {patterns.eyelashes.map((pattern, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center rounded-sm border border-transparent text-white/80",
              {
                "border-white/80": selectedPattern === pattern.value,
              },
            )}
            onClick={() => {
              if (selectedPattern === pattern.value) {
                setSelectedPattern(null);
              } else {
                setSelectedPattern(pattern.value);
                // setLashesPattern(index);
              }
            }}
          >
            <img
              src={eyelashes[index % eyelashes.length]}
              alt="Lashes shape"
              className="size-12 rounded"
            />
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
