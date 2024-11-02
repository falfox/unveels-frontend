import { Suspense } from "react";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { useBrandsQuerySuspense } from "./api/brands";
import { useCategoriesQuerySuspense } from "./api/categories";
import "./index.css";
import { FaceAnalyzer } from "./pages/face-analyzer";
import { PersonalityFinder } from "./pages/personality-finder";
import { PersonalityFinderWeb } from "./pages/personality-finder-web-";
import { SkinAnalysis } from "./pages/skin-analysis";
import { SkinToneFinder } from "./pages/skin-tone-finder";
import { SkinToneFinderWeb } from "./pages/skin-tone-finder-web";
import { TryOnSelector, VirtualTryOn } from "./pages/virtual-try-on";
import { EyeLinerSelector } from "./pages/vto/eyes/eye-liners/eye-liner";
import { EyeShadowSelector } from "./pages/vto/eyes/eye-shadow/eye-shadow";
import { EyebrowsSelector } from "./pages/vto/eyes/eyebrows/eyebrows";
import { EyesMode } from "./pages/vto/eyes/eyes-makeup";
import { LashesSelector } from "./pages/vto/eyes/lashes/lashes";
import { LenseSelector } from "./pages/vto/eyes/lenses/lense";
import { MascaraSelector } from "./pages/vto/eyes/mascara/mascara";
import { BlushSelector } from "./pages/vto/face/blush/blush";
import { BronzerSelector } from "./pages/vto/face/bronzer/bronzer";
import { ConcealerSelector } from "./pages/vto/face/concealer/concealer";
import { ContourSelector } from "./pages/vto/face/contour/contour";
import { FaceMode } from "./pages/vto/face/face-makeup";
import { FoundationSelector } from "./pages/vto/face/foundation/foundation";
import { HighlighterSelector } from "./pages/vto/face/highlighter/highlighter";
import { HairColorSelector } from "./pages/vto/hair/hair-color/hair-color";
import { HairMode } from "./pages/vto/hair/hair-makeup";
import { HandwearSelector } from "./pages/vto/hand-accessories/handwear/handwear";
import { WatchesSelector } from "./pages/vto/hand-accessories/watches/watches";
import { EarringsSelector } from "./pages/vto/head-accesories/earrings/earrings";
import { GlassesSelector } from "./pages/vto/head-accesories/glasses/glasses";
import { HatsSelector } from "./pages/vto/head-accesories/hats/hats";
import { HeadbandSelector } from "./pages/vto/head-accesories/headband/headband";
import { TiaraSelector } from "./pages/vto/head-accesories/tiaras/tiaras";
import { LipColorSelector } from "./pages/vto/lips/lip-color/lip-color";
import { LipLinerSelector } from "./pages/vto/lips/lip-liner/lip-liner";
import { LipPlumperSelector } from "./pages/vto/lips/lip-plumper/lip-plumper";
import { LipsMode } from "./pages/vto/lips/lips-makeup";
import { NailPolishSelector } from "./pages/vto/nails/nail-polish/nail-polish";
import { NailsMode } from "./pages/vto/nails/nails-makeup";
import { PressOnNailsSelector } from "./pages/vto/nails/press-on-nails/press-on-nails";
import { NeckwearSelector } from "./pages/vto/neck-accessories/neckwear/neckwear";
import { ScarvesSelector } from "./pages/vto/neck-accessories/scarves/scarves";
import { SingleVirtualTryOn } from "./pages/single-virtual-try-on";
import { FindTheLook } from "./pages/find-the-look";

// Define routes using object syntax
const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Home />
      </Suspense>
    ),
  },
  { path: "/skin-tone-finder", element: <SkinToneFinder /> },
  { path: "/personality-finder", element: <PersonalityFinder /> },
  { path: "/face-analyzer", element: <FaceAnalyzer /> },
  { path: "/skin-analysis", element: <SkinAnalysis /> },
  { path: "/find-the-look", element: <FindTheLook /> },
  { path: "/personality-finder-web", element: <PersonalityFinderWeb /> },
  { path: "/skin-tone-finder-web", element: <SkinToneFinderWeb /> },
  {
    path: "/virtual-try-on-product/:sku",
    element: <SingleVirtualTryOn />,
  },
  {
    path: "/virtual-try-on",
    element: <VirtualTryOn />,
    children: [
      { path: "makeups", element: <TryOnSelector /> },
      // Lips
      { path: "lips", element: <LipsMode /> },
      { path: "lip-color", element: <LipColorSelector /> },
      { path: "lip-liner", element: <LipLinerSelector /> },
      { path: "lip-plumper", element: <LipPlumperSelector /> },
      // Eyes
      { path: "eyes", element: <EyesMode /> },
      { path: "eyebrows", element: <EyebrowsSelector /> },
      { path: "eye-shadow", element: <EyeShadowSelector /> },
      { path: "eye-liner", element: <EyeLinerSelector /> },
      { path: "lashes", element: <LashesSelector /> },
      { path: "mascara", element: <MascaraSelector /> },
      { path: "lenses", element: <LenseSelector /> },
      // Face
      { path: "face", element: <FaceMode /> },
      { path: "foundation", element: <FoundationSelector /> },
      { path: "concealer", element: <ConcealerSelector /> },
      { path: "contour", element: <ContourSelector /> },
      { path: "blush", element: <BlushSelector /> },
      { path: "bronzer", element: <BronzerSelector /> },
      { path: "highlighter", element: <HighlighterSelector /> },
      // Nails
      { path: "nails", element: <NailsMode /> },
      { path: "nail-polish", element: <NailPolishSelector /> },
      { path: "press-on-nails", element: <PressOnNailsSelector /> },
      // Hair
      { path: "hair", element: <HairMode /> },
      { path: "hair-color", element: <HairColorSelector /> },

      // Head
      { path: "sunglasses", element: <GlassesSelector /> },
      { path: "glasses", element: <GlassesSelector /> },
      { path: "earrings", element: <EarringsSelector /> },
      { path: "headbands", element: <HeadbandSelector /> },
      { path: "hats", element: <HatsSelector /> },
      { path: "tiaras", element: <TiaraSelector /> },
      // Neck
      { path: "pendants", element: <NeckwearSelector /> },
      { path: "necklaces", element: <NeckwearSelector /> },
      { path: "chokers", element: <NeckwearSelector /> },
      { path: "scarves", element: <ScarvesSelector /> },
      // Hand
      { path: "rings", element: <HandwearSelector /> },
      { path: "bracelets", element: <HandwearSelector /> },
      { path: "bangles", element: <HandwearSelector /> },
      { path: "watches", element: <WatchesSelector /> },
    ],
  },
];

// Create a memory router instance
const router = createBrowserRouter(routes, {
  // initialEntries: ["/virtual-try-on/makeups"], // Set the initial route
  // initialIndex: 0,
});

function Home() {
  useCategoriesQuerySuspense();
  useBrandsQuerySuspense();

  return (
    <div className="absolute left-0 flex flex-col gap-4 top-4">
      <LinkButton to="/skin-tone-finder">Skin Tone Finder</LinkButton>
      <LinkButton to="/personality-finder">Personality Finder</LinkButton>
      <LinkButton to="/face-analyzer">Face Analyzer</LinkButton>
      <LinkButton to="/skin-analysis">Skin Analysis</LinkButton>
      <LinkButton to="/find-the-look">Find The Look</LinkButton>
      <LinkButton to="/personality-finder-web">
        Personality Finder Web
      </LinkButton>
      <LinkButton to="/skin-tone-finder-web">Skin Tone Finder Web</LinkButton>
      <LinkButton to="/virtual-try-on/makeups">Virtual Try On</LinkButton>
    </div>
  );
}
function App() {
  return <RouterProvider router={router} />;
}

// Link button component
function LinkButton({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link to={to}>
      <button type="button" className="border border-black">
        {children}
      </button>
    </Link>
  );
}

export default App;
