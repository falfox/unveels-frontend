import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./index.css";
import { useCategoriesQuerySuspense } from "./api/categories";
import { useBrandsQuerySuspense } from "./api/brands";
import VoiceCommand from "./components/voice-command/voice-command";

// Halaman yang diimpor
import { SkinToneFinder } from "./pages/skin-tone-finder";
import { PersonalityFinder } from "./pages/personality-finder";
import { FaceAnalyzer } from "./pages/face-analyzer";
import { SkinAnalysis } from "./pages/skin-analysis";
import { FindTheLook } from "./pages/find-the-look";
import { PersonalityFinderWeb } from "./pages/personality-finder-web";
import { SkinToneFinderWeb } from "./pages/skin-tone-finder-web";
import { VirtulAssistant } from "./pages/assistant/virtual-assistant";
import { SingleVirtualTryOn } from "./pages/single-virtual-try-on";
import { VirtualTryOn, TryOnSelector } from "./pages/virtual-try-on";
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

// Komponen Home
function Home() {
  useCategoriesQuerySuspense();
  useBrandsQuerySuspense();

  return (
    <div className="absolute left-0 top-4 flex flex-col gap-4">
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
      <LinkButton to="/virtual-assistant">Virtual Assistant</LinkButton>
    </div>
  );
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

// Komponen Utama App
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Home />
              </Suspense>
            }
          />
          <Route path="/skin-tone-finder" element={<SkinToneFinder />} />
          <Route path="/personality-finder" element={<PersonalityFinder />} />
          <Route path="/face-analyzer" element={<FaceAnalyzer />} />
          <Route path="/skin-analysis" element={<SkinAnalysis />} />
          <Route path="/find-the-look" element={<FindTheLook />} />
          <Route
            path="/personality-finder-web"
            element={<PersonalityFinderWeb />}
          />
          <Route path="/skin-tone-finder-web" element={<SkinToneFinderWeb />} />
          <Route path="/virtual-assistant" element={<VirtulAssistant />} />
          <Route
            path="/virtual-try-on-product/:sku"
            element={<SingleVirtualTryOn />}
          />
          <Route path="/virtual-try-on" element={<VirtualTryOn />}>
            {/* Rute anak untuk Virtual Try On */}
            <Route path="makeups" element={<TryOnSelector />} />

            {/* Lips */}
            <Route path="lips" element={<LipsMode />} />
            <Route path="lip-color" element={<LipColorSelector />} />
            <Route path="lip-liner" element={<LipLinerSelector />} />
            <Route path="lip-plumper" element={<LipPlumperSelector />} />

            {/* Eyes */}
            <Route path="eyes" element={<EyesMode />} />
            <Route path="eyebrows" element={<EyebrowsSelector />} />
            <Route path="eye-shadow" element={<EyeShadowSelector />} />
            <Route path="eye-liner" element={<EyeLinerSelector />} />
            <Route path="lashes" element={<LashesSelector />} />
            <Route path="mascara" element={<MascaraSelector />} />
            <Route path="lenses" element={<LenseSelector />} />

            {/* Face */}
            <Route path="face" element={<FaceMode />} />
            <Route path="foundation" element={<FoundationSelector />} />
            <Route path="concealer" element={<ConcealerSelector />} />
            <Route path="contour" element={<ContourSelector />} />
            <Route path="blush" element={<BlushSelector />} />
            <Route path="bronzer" element={<BronzerSelector />} />
            <Route path="highlighter" element={<HighlighterSelector />} />

            {/* Nails */}
            <Route path="nails" element={<NailsMode />} />
            <Route path="nail-polish" element={<NailPolishSelector />} />
            <Route path="press-on-nails" element={<PressOnNailsSelector />} />

            {/* Hair */}
            <Route path="hair" element={<HairMode />} />
            <Route path="hair-color" element={<HairColorSelector />} />

            {/* Head */}
            <Route path="sunglasses" element={<GlassesSelector />} />
            <Route path="glasses" element={<GlassesSelector />} />
            <Route path="earrings" element={<EarringsSelector />} />
            <Route path="headbands" element={<HeadbandSelector />} />
            <Route path="hats" element={<HatsSelector />} />
            <Route path="tiaras" element={<TiaraSelector />} />

            {/* Neck */}
            <Route path="pendants" element={<NeckwearSelector />} />
            <Route path="necklaces" element={<NeckwearSelector />} />
            <Route path="chokers" element={<NeckwearSelector />} />
            <Route path="scarves" element={<ScarvesSelector />} />

            {/* Hand */}
            <Route path="rings" element={<HandwearSelector />} />
            <Route path="bracelets" element={<HandwearSelector />} />
            <Route path="bangles" element={<HandwearSelector />} />
            <Route path="watches" element={<WatchesSelector />} />
          </Route>
        </Routes>

        {/* VoiceCommand ditempatkan di luar <Routes> agar tetap terlihat di semua halaman */}
        <VoiceCommand />
      </div>
    </Router>
  );
}

export default App;
