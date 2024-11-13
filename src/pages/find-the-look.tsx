import clsx from "clsx";
import {
  ChevronLeft,
  CirclePlay,
  Heart,
  PauseCircle,
  StopCircle,
  X,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import {
  getFaceMakeupProductTypeIds,
  getLashMakeupProductTypeIds,
  getLensesProductTypeIds,
  getLipsMakeupProductTypeIds,
} from "../api/attributes/makeups";
import { useProducts } from "../api/get-product";
import { useLipsProductQuery } from "../api/lips";
import {
  FindTheLookProvider,
  useFindTheLookContext,
} from "../context/find-the-look-context";
import { Footer } from "../components/footer";
import { Icons } from "../components/icons";
import { LoadingProducts } from "../components/loading";
import { BrandName } from "../components/product/brand";
import { Rating } from "../components/rating";
import { VideoScene } from "../components/recorder/recorder";
import { CameraProvider, useCamera } from "../context/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { ShareModal } from "../components/share-modal";
import { SkinAnalysisProvider } from "../context/skin-analysis-context";
import { SkinAnalysisScene } from "../components/skin-analysis/skin-analysis-scene";
import { useRecordingControls } from "../hooks/useRecorder";
import { skinAnalysisInference } from "../inference/skinAnalysisInference";
import { FaceResults } from "../types/faceResults";
import { getProductAttributes, mediaUrl } from "../utils/apiUtils";
import { TopNavigation } from "../components/top-navigation";
import {
  headAccessoriesProductTypeFilter,
  neckAccessoriesProductTypeFilter,
} from "../api/attributes/accessories";
import { FindTheLookScene } from "../components/find-the-look/find-the-look-scene";
import { FindTheLookMainScreen } from "../components/find-the-look/find-the-look-main-screen";
import { FindTheLookItems } from "../types/findTheLookItems";

export function FindTheLook() {
  return (
    <CameraProvider>
      <SkinAnalysisProvider>
        <FindTheLookProvider>
          <div className="h-full min-h-dvh">
            <Main />
          </div>
        </FindTheLookProvider>
      </SkinAnalysisProvider>
    </CameraProvider>
  );
}

function Main() {
  const { criterias } = useCamera();
  const [selectionMade, setSelectionMade] = useState(false);

  // Fungsi ini akan dijalankan ketika pilihan sudah dibuat
  const handleSelection = () => {
    setSelectionMade(true);
  };

  return (
    <>
      {!selectionMade && (
        <FindTheLookMainScreen onSelection={handleSelection} />
      )}
      {selectionMade && (
        <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
          <div className="absolute inset-0">
            {criterias.isCaptured && criterias.capturedImage ? (
              <FindTheLookScene />
            ) : (
              <>
                <VideoStream />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
                    zIndex: 0,
                  }}
                ></div>
              </>
            )}
          </div>
          <RecorderStatus />
          <TopNavigation item={false} />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
            <MainContent />
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

function MainContent() {
  const { criterias } = useCamera();
  const [shareOpen, setShareOpen] = useState(false);

  if (criterias.isFinished) {
    return shareOpen ? (
      <ShareModal
        onClose={() => {
          setShareOpen(false);
        }}
      />
    ) : (
      <div className="flex space-x-5 px-5 pb-10 font-serif">
        <button
          type="button"
          className="h-10 w-full rounded border border-[#CA9C43] text-white"
        >
          Exit
        </button>
        <button
          type="button"
          className="h-10 w-full rounded bg-gradient-to-r from-[#CA9C43] to-[#92702D] text-white"
          onClick={() => setShareOpen(true)}
        >
          Share <Icons.share className="ml-4 inline-block size-6" />
        </button>
      </div>
    );
  }

  return <BottomContent />;
}

function MakeupCategories({ makeups }: { makeups: FindTheLookItems[] }) {
  const [tab, setTab] = useState<string | undefined>(makeups[0]?.section);
  const { setView } = useFindTheLookContext();

  return (
    <div className="relative space-y-2 px-4 pb-4">
      <div className="flex w-full items-center space-x-3.5 overflow-x-auto pt-7 no-scrollbar">
        {makeups.map((category) => {
          const isActive = tab === category.section;
          return (
            <Fragment key={category.section}>
              <button
                className={`shrink-0 rounded-full border px-3 py-1 text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-800"
                    : ""
                }`}
                onClick={() => setTab(category.section)}
              >
                {category.section}
              </button>
            </Fragment>
          );
        })}
      </div>

      {/* Only render ProductList if a valid tab (section) is selected */}
      {tab && mapTypes[tab] ? <ProductList product_type={tab} /> : null}
    </div>
  );
}

function AccessoriesCategories({
  accessories,
}: {
  accessories: FindTheLookItems[];
}) {
  const [tab, setTab] = useState<string | undefined>(accessories[0]?.section);
  const { setView } = useFindTheLookContext();

  return (
    <div className="relative space-y-2 px-4 pb-4">
      <div className="flex w-full items-center space-x-3.5 overflow-x-auto pt-7 no-scrollbar">
        {accessories.map((category) => {
          const isActive = tab === category.section;
          return (
            <Fragment key={category.section}>
              <button
                className={`shrink-0 rounded-full border px-3 py-1 text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-800"
                    : ""
                }`}
                onClick={() => setTab(category.section)}
              >
                {category.section}
              </button>
            </Fragment>
          );
        })}
      </div>

      {/* Only render ProductList if a valid tab (section) is selected */}
      {tab && mapTypes[tab] ? <ProductList product_type={tab} /> : null}
    </div>
  );
}

const mapTypes: {
  [key: string]: {
    attributeName: string;
    values: string[];
  };
} = {
  // Makeups
  Lipstick: {
    attributeName: "lips_makeup_product_type",
    values: getLipsMakeupProductTypeIds([
      "Lipsticks",
      "Lip Stains",
      "Lip Tints",
      "Lip Glosses",
    ]),
  },
  Mascara: {
    attributeName: "lash_makeup_product_type",
    values: getLashMakeupProductTypeIds(["Mascaras"]),
  },
  Blusher: {
    attributeName: "face_makeup_product_type",
    values: getFaceMakeupProductTypeIds(["Blushes"]),
  },
  Highlighter: {
    attributeName: "face_makeup_product_type",
    values: getFaceMakeupProductTypeIds(["Highlighters"]),
  },
  Eyecolor: {
    attributeName: "lenses_product_type",
    values: getLensesProductTypeIds(["Daily Lenses", "Monthly Lenses"]),
  },

  // Accessories
  Sunglasses: {
    attributeName: "head_accessories_product_type",
    values: headAccessoriesProductTypeFilter(["Sunglasses"]),
  },
  Chokers: {
    attributeName: "neck_accessories_product_type",
    values: neckAccessoriesProductTypeFilter(["Chokers"]),
  },
  Earrings: {
    attributeName: "head_accessories_product_type",
    values: headAccessoriesProductTypeFilter(["Earrings"]),
  },
};

function ProductList({ product_type }: { product_type: string }) {
  const { data } = useProducts({
    product_type_key: mapTypes[product_type].attributeName,
    type_ids: mapTypes[product_type].values,
  });

  return (
    <div className="flex w-full gap-4 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {data ? (
        data.items.map((product, index) => {
          const imageUrl =
            mediaUrl(product.media_gallery_entries[0].file) ??
            "https://picsum.photos/id/237/200/300";

          return (
            <div key={product.id} className="w-[115px] rounded shadow">
              <div className="relative h-[80px] w-[115px] overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Product"
                  className="rounded object-cover"
                />
              </div>

              <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
                {product.name}
              </h3>

              <p className="h-3 text-[0.5rem] text-white/60">
                <BrandName brandId={getProductAttributes(product, "brand")} />
              </p>

              <div className="flex items-end justify-between space-x-1 pt-1">
                <div className="bg-gradient-to-r from-[#CA9C43] to-[#92702D] bg-clip-text text-[0.625rem] text-transparent">
                  ${product.price.toFixed(2)}
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
      ) : (
        <LoadingProducts />
      )}
    </div>
  );
}

const groupedItems = (findTheLookItems: FindTheLookItems[]) => {
  if (!findTheLookItems) return { makeup: [], accessories: [] };
  return {
    makeup: findTheLookItems.filter((item) => item.section === "makeup"),
    accessories: findTheLookItems.filter(
      (item) => item.section === "accessories",
    ),
  };
};

function BottomContent() {
  const { criterias, setCriterias } = useCamera();
  const { view, setView, findTheLookItems } = useFindTheLookContext();
  const [groupedItemsData, setGroupedItemsData] = useState<{
    makeup: FindTheLookItems[];
    accessories: FindTheLookItems[];
  }>({
    makeup: [],
    accessories: [],
  });

  useEffect(() => {
    if (findTheLookItems) {
      const grouped = groupedItems(findTheLookItems);
      setGroupedItemsData(grouped);
    }
  }, [findTheLookItems]);

  if (criterias.isCaptured) {
    if (view === "face") {
      return (
        <InferenceResults
          onFaceClick={() => {
            setView("single_category");
          }}
          onResultClick={() => {
            setView("recommendations");
          }}
        />
      );
    }

    if (view === "recommendations") {
      return (
        <ProductRecommendationsTabs
          groupedItemsData={groupedItemsData}
          onClose={() => setView("face")}
        />
      );
    }

    if (view === "single_category") {
      return (
        <SingleCategoryView
          category="Lipstick"
          onClose={() => {
            setView("face");
          }}
        />
      );
    }

    return (
      <AllProductsPage
        onClose={() => {
          setView("face");
        }}
      />
    );
  }

  return <VideoScene />;
}

function InferenceResults({
  onFaceClick,
  onResultClick,
}: {
  onFaceClick?: () => void;
  onResultClick?: () => void;
}) {
  return (
    <>
      <div className="absolute inset-x-0 bottom-32 flex items-center justify-center">
        <button
          type="button"
          className="bg-black px-10 py-3 text-sm text-white"
          onClick={() => {
            onResultClick?.();
          }}
        >
          FIND THE LOOK
        </button>
      </div>
    </>
  );
}

function ProductRecommendationsTabs({
  groupedItemsData,
  onClose,
}: {
  groupedItemsData: {
    makeup: FindTheLookItems[];
    accessories: FindTheLookItems[];
  };
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"makeup" | "accessories">("makeup");

  return (
    <>
      <div className="fixed inset-0 h-full w-full" onClick={onClose}></div>
      <div className="mx-auto w-full space-y-2 px-4 lg:max-w-xl">
        <div className="flex h-10 w-full items-center justify-between border-b border-gray-600 text-center">
          {["makeup", "accessories"].map((shadeTab) => {
            const isActive = tab === shadeTab;
            return (
              <Fragment key={shadeTab}>
                <button
                  key={shadeTab}
                  className={`relative h-10 grow border-b text-lg ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                  onClick={() => setTab(shadeTab as "makeup" | "accessories")}
                >
                  {shadeTab.charAt(0).toUpperCase() + shadeTab.slice(1)}
                </button>
              </Fragment>
            );
          })}
        </div>
      </div>
      {tab === "makeup" ? (
        <MakeupCategories makeups={groupedItemsData.makeup} />
      ) : (
        <AccessoriesCategories accessories={groupedItemsData.accessories} />
      )}
    </>
  );
}

function AllProductsPage({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"makeup" | "accessories">("makeup");
  const { selectedItems: cart, dispatch } = useFindTheLookContext();

  return (
    <div
      className={clsx(
        "fixed inset-0 flex h-dvh flex-col bg-black font-sans text-white",
      )}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-2">
        <button type="button" className="size-6" onClick={() => onClose()}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-end space-x-2.5">
          <Heart className="size-6" />
          <Icons.bag className="size-6" />
        </div>
      </div>

      {cart.items.length > 0 ? (
        <div className="mx-auto my-4 flex w-fit space-x-2.5 rounded-lg bg-white/25 p-4">
          {cart.items.map((product) => {
            const imageUrl = mediaUrl(
              product.media_gallery_entries[0].file,
            ) as string;
            return (
              <div className="relative size-9">
                <img src={imageUrl} className="h-full w-full object-cover" />

                <div className="absolute right-0 top-0">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "remove", payload: product });
                    }}
                  >
                    <X className="size-5 text-black" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[480px] px-4 py-3">
        {["makeup", "accessories"].map((item) => (
          <button
            key={item}
            type="button"
            className={clsx(
              "flex h-8 w-full items-center justify-center border text-xs uppercase",
              item === tab
                ? "border-white bg-white text-black"
                : "border-white text-white",
            )}
            onClick={() => {
              dispatch({ type: "reset" });
              setTab(item as "makeup" | "accessories");
            }}
          >
            Similar {item}
          </button>
        ))}
      </div>

      {tab === "makeup" ? <MakeupAllView /> : <AccessoriesAllView />}

      <div className="h-20">
        <div className="mx-auto flex max-w-sm space-x-2.5 pb-6 pt-4 lg:space-x-6">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center border border-white text-xs font-semibold text-white"
          >
            TRY NOW
          </button>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center border border-white bg-white text-xs font-semibold text-black"
          >
            ADD ALL TO CART
          </button>
        </div>
      </div>
    </div>
  );
}

function MakeupAllView() {
  return (
    <div className="h-full flex-1 overflow-y-auto px-5">
      <div className="space-y-14">
        {makeups.map((category) => (
          <ProductHorizontalList category={category} />
        ))}
      </div>
    </div>
  );
}

function ProductHorizontalList({ category }: { category: string }) {
  const { data } = useProducts({
    product_type_key: mapTypes[category].attributeName,
    type_ids: mapTypes[category].values,
  });

  const { selectedItems: cart, dispatch } = useFindTheLookContext();

  return (
    <div key={category}>
      <div className="py-4">
        <h2 className="text-base text-[#E6E5E3]">{category}</h2>
      </div>
      <div className="flex w-full gap-4 overflow-x-auto no-scrollbar active:cursor-grabbing">
        {data ? (
          data.items.map((product, index) => {
            const imageUrl =
              mediaUrl(product.media_gallery_entries[0].file) ??
              "https://picsum.photos/id/237/200/300";

            return (
              <div
                key={product.id}
                className="w-[calc(50%-0.5rem)] shrink-0 rounded shadow lg:w-[calc(20%-0.5rem)]"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Product"
                    className="h-full w-full rounded object-cover"
                  />
                </div>

                <h3 className="line-clamp-2 h-10 pt-2.5 text-xs font-semibold text-white">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/60">
                    <BrandName
                      brandId={getProductAttributes(product, "brand")}
                    />
                  </p>
                  <div className="flex flex-wrap items-center justify-end gap-x-1">
                    <span className="text-sm font-bold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Rating rating={4} />
                <div className="flex space-x-1 pt-1">
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-center border border-white text-xs font-semibold text-white"
                  >
                    ADD TO CART
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-center border border-white bg-white text-xs font-semibold text-black"
                    onClick={() => {
                      dispatch({ type: "add", payload: product });
                    }}
                  >
                    SELECT
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <LoadingProducts />
        )}
      </div>
    </div>
  );
}

function AccessoriesAllView() {
  return (
    <div className="h-full flex-1 overflow-y-auto px-5">
      <div className="space-y-14">
        {accessories.map((category) => (
          <ProductHorizontalList category={category} />
        ))}
      </div>
    </div>
  );
}

function SingleCategoryView({
  category,
  onClose,
}: {
  category: string;
  onClose: () => void;
}) {
  const { data } = useLipsProductQuery({});

  return (
    <div
      className={clsx(
        "fixed inset-0 flex h-dvh flex-col bg-black font-sans text-white",
      )}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-2">
        <button type="button" className="size-6" onClick={() => onClose()}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-end space-x-2.5">
          <Heart className="size-6" />
          <Icons.bag className="size-6" />
        </div>
      </div>

      <div className="h-full flex-1 overflow-y-auto px-5">
        <div className="py-4">
          <h2 className="text-base text-[#E6E5E3]">{category}</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5 py-4 sm:grid-cols-3 xl:grid-cols-5">
          {data
            ? data.items.map((product, index) => {
                const imageUrl = mediaUrl(
                  product.media_gallery_entries[0].file,
                ) as string;
                return (
                  <div key={product.id} className="w-full rounded shadow">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Product"
                        className="h-full w-full rounded object-cover"
                      />
                    </div>

                    <h3 className="line-clamp-2 pt-2.5 text-xs font-semibold text-white">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/60">
                        <BrandName
                          brandId={getProductAttributes(product, "brand")}
                        />
                      </p>
                      <div className="flex flex-wrap items-center justify-end gap-x-1">
                        <span className="text-sm font-bold text-white">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Rating rating={4} />
                    <div className="flex space-x-1 pt-1">
                      <button
                        type="button"
                        className="flex h-10 w-full items-center justify-center border border-white text-xs font-semibold text-white"
                      >
                        ADD TO CART
                      </button>
                      <button
                        type="button"
                        className="flex h-10 w-full items-center justify-center border border-white bg-white text-xs font-semibold text-black"
                      >
                        TRY ON
                      </button>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}

function RecorderStatus() {
  const { isRecording, formattedTime, handleStartPause, handleStop, isPaused } =
    useRecordingControls();
  const { finish } = useCamera();

  return (
    <div className="absolute inset-x-0 top-14 flex items-center justify-center gap-4">
      <button
        className="flex size-8 items-center justify-center"
        onClick={handleStartPause}
      >
        {isPaused ? (
          <CirclePlay className="size-6 text-white" />
        ) : isRecording ? (
          <PauseCircle className="size-6 text-white" />
        ) : null}
      </button>
      <span className="relative flex size-4">
        {isRecording ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        ) : null}
        <span className="relative inline-flex size-4 rounded-full bg-red-500"></span>
      </span>
      <div className="font-serif text-white">{formattedTime}</div>
      <button
        className="flex size-8 items-center justify-center"
        onClick={
          isRecording
            ? () => {
                handleStop();
                finish();
              }
            : handleStartPause
        }
      >
        {isRecording || isPaused ? (
          <StopCircle className="size-6 text-white" />
        ) : (
          <CirclePlay className="size-6 text-white" />
        )}
      </button>
    </div>
  );
}
