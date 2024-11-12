import {
  Link,
  Outlet,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import { RecorderStatus } from "../components/assistant";
import {
  CameraProvider,
  useCamera,
} from "../components/recorder/recorder-context";
import { SkinColorProvider } from "../components/skin-tone-finder-scene/skin-color-context";
import { AccesoriesProvider } from "../components/three/accesories-context";
import { MakeupProvider } from "../components/three/makeup-context";
import { VirtualTryOnScene } from "../components/vto/virtual-try-on-scene";
import { ChevronDown, ChevronLeft, Heart, Plus, X } from "lucide-react";
import { CSSProperties, useState } from "react";
import { Icons } from "../components/icons";
import { usePage } from "../hooks/usePage";
import { div } from "three/webgpu";
import { Rating } from "../components/rating";
import data from "../assets/message.json";
import { Footer } from "../components/footer";

export function SingleVirtualTryOn() {
  return (
    <CameraProvider>
      <SkinColorProvider>
        <MakeupProvider>
          <AccesoriesProvider>
            <div className="h-full min-h-dvh">
              <Main />
            </div>
          </AccesoriesProvider>
        </MakeupProvider>
      </SkinColorProvider>
    </CameraProvider>
  );
}

function Main() {
  return (
    <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
      <div className="absolute inset-0">
        <VirtualTryOnScene />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        ></div>
      </div>
      <TopNavigation />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
        {/* <Sidebar /> */}
        <MainContent />
        <Footer />
      </div>
      <RecorderStatus />
    </div>
  );
}

export function TopNavigation({
  item = false,
  cart = false,
}: {
  item?: boolean;
  cart?: boolean;
}) {
  const { setPage } = usePage();
  const { flipCamera } = useCamera();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
      <div className="flex flex-col gap-4">
        <Link
          className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl"
          to="/virtual-try-on/makeups"
        >
          <ChevronLeft className="size-6 text-white" />
        </Link>

        {item ? (
          <div className="space-y-2 pt-10">
            <div className="flex gap-x-4">
              <button className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/25 backdrop-blur-3xl">
                <Heart className="size-5 text-white" />
              </button>
              <div>
                <p className="font-semibold leading-4 text-white">
                  Pro Filt’r Soft Matte Longwear Liquid Found
                </p>
                <p className="text-white/60">Brand Name</p>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <button className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/25 backdrop-blur-3xl">
                <Plus className="size-5 text-white" />
              </button>
              <p className="font-medium text-white">$52.00</p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">
        <Link
          type="button"
          className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl"
          to="/"
        >
          <X className="size-6 text-white" />
        </Link>
        <div className="relative -m-0.5 p-0.5">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={
              {
                background: `linear-gradient(148deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.77) 100%) border-box`,
                "-webkit-mask": `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
                mask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
                "-webkit-mask-composite": "destination-out",
                "mask-composite": "exclude",
              } as CSSProperties
            }
          />
          <button
            type="button"
            className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl"
            onClick={flipCamera}
          >
            <Icons.flipCamera className="size-6 text-white" />
          </button>
        </div>
        <button
          type="button"
          className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl"
        >
          <Icons.myCart className="size-6 text-white" />
        </button>
      </div>
    </div>
  );
}

export function MainContent() {
  const { sku } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      {sku ? (
        <>
          {collapsed ? null : <BottomContent />}
          <div className="flex justify-center">
            <button type="button" onClick={() => setCollapsed(!collapsed)}>
              <ChevronDown className="size-6 text-white" />
            </button>
          </div>
        </>
      ) : (
        <div className="h-screen w-full overflow-y-scroll bg-black/90">
          <h5 className="mb-5 mt-20 text-center text-white">Lip Color</h5>
          <ProductList />
        </div>
      )}
    </>
  );
}

function BottomContent() {
  return <Outlet />;
}

export function ProductList() {
  const configurableData = data.items.filter(
    (d) => d.type_id === "configurable",
  );
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {configurableData.map((item, i) => (
        <ProductCard item={item} key={i} />
      ))}
    </div>
  );
}

export function ProductCard({ item }: { item: any }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col text-white">
      <div className="relative h-64 w-64 overflow-hidden">
        <img
          src={"https://picsum.photos/id/77/256/256"}
          alt="Product"
          className="object-cover object-center"
        />
        <button className="absolute right-2 top-2 text-black">icon</button>
      </div>
      <div className="mt-3 flex w-full justify-between">
        <div className="">
          <h2 className="w-40 truncate font-bold">{item.name}</h2>
          <p className="rating">Brand Name</p>
          <Rating rating={4} />
        </div>
        <div>
          <h2 className="flex-1 text-lg font-bold">${item.price}</h2>
        </div>
      </div>
      <div className="mt-3 flex space-x-1">
        <button className="flex w-full items-center justify-center gap-2 border border-white bg-black/25 px-4 py-2 text-sm">
          ADD TO CART
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 bg-white px-4 py-2 text-sm text-black"
          onClick={() => navigate(`/virtual-try-on-product/${item.sku}`)}
        >
          TRY ON
        </button>
      </div>
    </div>
  );
}
