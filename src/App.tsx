import { ReactNode, useState } from "react";
import { SkinToneFinder } from "./pages/skin-tone-finder";
import { PersonalityFinder } from "./pages/personality-finder";

import "./index.css";

const defaultPage = "personality-finder-web" as const;

const pages = [
  "skin-tone-finder",
  "personality-finder",
  "skin-analysis",
  "face-analyzer",
  "personality-finder-web",
] as const;

export type Page = (typeof pages)[number] | null;
import { createContext, useContext } from "react";
import { SkinAnalysis } from "./pages/skin-analysis";
import { FaceAnalyzer } from "./pages/face-analyzer";
import { PersonalityFinderWeb } from "./pages/personality-finder-web-";

interface PageContextType {
  page: Page;
  setPage: (page: Page) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = useState<Page>(defaultPage);

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = (): PageContextType => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
};

function App() {
  const { page, setPage } = usePage();

  return (
    <>
      <div className="absolute left-0 top-4 flex flex-col gap-4">
        <button
          type="button"
          className="border border-black"
          onClick={() => setPage("skin-tone-finder")}
        >
          Skin Tone Finder
        </button>
        <button
          type="button"
          className="border border-black"
          onClick={() => setPage("personality-finder")}
        >
          Personality Finder
        </button>
        <button
          type="button"
          className="border border-black"
          onClick={() => setPage("face-analyzer")}
        >
          Face Analyzer
        </button>
        <button
          type="button"
          className="border border-black"
          onClick={() => setPage("skin-analysis")}
        >
          Skin Analysis
        </button>
        <button
          type="button"
          className="border border-black"
          onClick={() => setPage("personality-finder-web")}
        >
          Personality Finder Web
        </button>
      </div>

      {page === "skin-tone-finder" && <SkinToneFinder />}
      {page === "personality-finder" && <PersonalityFinder />}
      {page === "face-analyzer" && <FaceAnalyzer />}
      {page === "skin-analysis" && <SkinAnalysis />}
      {page === "personality-finder-web" && <PersonalityFinderWeb />}
    </>
  );
}

export default App;
