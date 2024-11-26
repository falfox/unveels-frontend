import clsx from "clsx";
import { Icons } from "../../../../components/icons";

import { LashesProvider, useLashesContext } from "./lashes-context";
import { ColorPalette } from "../../../../components/color-palette";
import { Link } from "react-router-dom";
import { useLashesQuery } from "./lashes-query";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { patterns } from "../../../../api/attributes/pattern";

const colorFamilies = [{ name: "Black", value: "#000000" }];

export function LashesSelector() {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <FamilyColorSelector />

      <ColorSelector />

      <div className="flex h-10 w-full items-center justify-between text-center">
        <Link
          className={`relative h-10 grow text-lg`}
          to="/virtual-try-on/lashes"
        >
          <span className={"text-white"}>Lashes</span>
        </Link>
        <div className="h-5 border-r border-white"></div>
        <Link
          className={`relative h-10 grow text-lg`}
          to="/virtual-try-on/mascara"
        >
          <span className={"text-white/60"}>Mascara</span>
        </Link>
      </div>

      <ShapeSelector />

      <ProductList />
    </div>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useLashesContext();

  return (
    <div
      className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {colorFamilies.map((item, index) => (
        <button
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
            style={{
              background: item.value,
            }}
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
  "/media/unveels/vto/eyelashesh/eyelashes-1.png",
  "/media/unveels/vto/eyelashesh/eyelashes-2.png",
  "/media/unveels/vto/eyelashesh/eyelashes-3.png",
  "/media/unveels/vto/eyelashesh/eyelashes-4.png",
  "/media/unveels/vto/eyelashesh/eyelashes-5.png",
  "/media/unveels/vto/eyelashesh/eyelashes-6.png",
  "/media/unveels/vto/eyelashesh/eyelashes-7.png",
  "/media/unveels/vto/eyelashesh/eyelashes-8.png",
  "/media/unveels/vto/eyelashesh/eyelashes-9.png",
];

function ShapeSelector() {
  const { selectedPattern, setSelectedPattern } = useLashesContext();
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
              }
            }}
          >
            <img
              src={eyelashes[index % eyelashes.length]}
              alt="Eyebrow"
              className="size-12 rounded"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductList() {
  const { colorFamily, selectedPattern } = useLashesContext();

  const { data, isLoading } = useLashesQuery({
    color: colorFamily,
    pattern: selectedPattern,
  });

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
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
