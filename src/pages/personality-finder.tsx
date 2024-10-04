import { ReactNode, useEffect, useState } from "react";
import { Icons } from "../components/icons";

import clsx from "clsx";
import {
  ChevronLeft,
  CirclePlay,
  Lightbulb,
  PauseCircle,
  Scan,
  ScanFace,
  StopCircle,
  X,
} from "lucide-react";
import { usePage } from "../App";
import { CircularProgressRings } from "../components/circle-progress-rings";
import { Footer } from "../components/footer";
import { Rating } from "../components/rating";
import { VideoScene } from "../components/recorder/recorder";
import {
  CriteriaProvider,
  useCriteria,
} from "../components/recorder/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { useRecordingControls } from "../hooks/useRecorder";
import { sleep } from "../utils";
import { TopNavigation } from "./skin-tone-finder";

export function PersonalityFinder() {
  return (
    <CriteriaProvider>
      <div className="h-full min-h-dvh">
        <MainContent />
      </div>
    </CriteriaProvider>
  );
}

function MainContent() {
  const { criterias, setCriterias } = useCriteria();

  useEffect(() => {
    (async () => {
      await sleep(2000);
      setCriterias((prev) => ({ ...prev, lighting: true }));
      await sleep(2000);
      setCriterias((prev) => ({ ...prev, facePosition: true }));
      await sleep(2000);
      setCriterias((prev) => ({ ...prev, orientation: true }));
    })();
  }, []);

  if (criterias.facePosition && criterias.lighting && criterias.orientation) {
    return <Result />;
  }

  return (
    <div className="relative mx-auto h-full min-h-dvh w-full max-w-[430px] bg-pink-950">
      <div className="absolute inset-0">
        <VideoStream />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        ></div>
      </div>
      <RecorderStatus />
      <TopNavigation />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
        <VideoScene />
        <Footer />
      </div>
    </div>
  );
}

function Result() {
  const tabs = [
    {
      title: "Personality",
    },
    {
      title: "Attributes",
    },
    {
      title: "Recommendations",
    },
  ];

  const [selectedTab, setTab] = useState(tabs[0].title);

  const { setPage } = usePage();

  return (
    <div className="flex flex-col h-screen font-sans text-white bg-black">
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-2">
        <button className="size-6">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button type="button" className="size-6" onClick={() => setPage(null)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-start px-5 py-6 space-x-1">
        <div className="px-5 shrink-0">
          <div className="flex items-center justify-center rounded-full bg-gradient-to-b from-[#CA9C43] to-[#644D21] p-1">
            <img
              className="rounded-full size-24"
              src="https://avatar.iran.liara.run/public/30"
              alt="Profile"
            />
          </div>

          <div className="pt-2 text-sm text-center">Extravert</div>
        </div>
        <div>
          <div className="flex items-center gap-x-1">
            <Icons.hashtagCircle className="size-4" />
            <div className="text-sm">AI Personality Analysis :</div>
          </div>
          <div className="pl-5 mt-1 text-xs">
            Your AI-generated self-portrait displays a friendly, outgoing
            personality. Interacting with people and AI are full of curiosity.
            Extroverted traits tend to be enthusiastic and social. You're the
            friendly, warm-hearted individual who likes to talk and connect with
            people.
          </div>
        </div>
      </div>

      {/* Tabs */}

      <div className="mx-auto w-full max-w-[430px] px-5">
        <div className="flex border-b-2 border-white/50">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={clsx(
                "w-full translate-y-0.5 border-b-2 py-2",
                tab.title === selectedTab
                  ? "border-[#CA9C43] bg-gradient-to-r from-[#92702D] to-[#CA9C43] bg-clip-text text-transparent"
                  : "border-transparent",
              )}
              onClick={() => setTab(tab.title)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {selectedTab === "Personality" ? <PersonalityTab /> : null}
      {selectedTab === "Attributes" ? <AttributesTab /> : null}
      {selectedTab === "Recommendations" ? <RecommendationsTab /> : null}
    </div>
  );
}
function PersonalityTab() {
  return (
    <div className="flex-1 px-10 py-6 space-y-6 overflow-auto">
      <h2 className="text-xl font-medium text-center">
        Main 5 Personality Traits
      </h2>

      <CircularProgressRings
        data={[
          { percentage: 90, color: "#B5179E" }, // Cyan
          { percentage: 75, color: "#5ED400" }, // Magenta
          { percentage: 60, color: "#4CC9F0" }, // Yellow
          { percentage: 45, color: "#F72585" }, // Green
          { percentage: 30, color: "#FFC300" }, // Magenta
        ]}
        className="mx-auto size-96"
      />
      <div className="flex items-start justify-between space-x-4 text-white bg-black">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Extraversion */}
          <div className="flex items-center space-x-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFC300] text-sm font-bold text-white">
              30%
            </div>
            <span>Extraversion</span>
          </div>

          {/* Conscientiousness */}
          <div className="flex items-center space-x-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F72585] text-sm font-bold text-white">
              45%
            </div>
            <span>Conscientiousness</span>
          </div>

          {/* Openness to Experience */}
          <div className="flex items-center space-x-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4CC9F0] text-sm font-bold text-white">
              60%
            </div>
            <span>Openness to Experience</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Agreeableness */}
          <div className="flex items-center space-x-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5DD400] text-sm font-bold text-white">
              75%
            </div>
            <span>Agreeableness</span>
          </div>

          {/* Neuroticism */}
          <div className="flex items-center space-x-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#B5179E] text-sm font-bold text-white">
              90%
            </div>
            <span>Neuroticism</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/50">
        <PersonalitySection
          title="Openness"
          description="People with an open personality are known for their vibrant imagination, curiosity, and eagerness to explore new ideas and experiences. You have a strong desire for novelty and diversity, and you're open to different perspectives and ways of thinking. With the trait of openness, you tend to be creative, flexible, and adaptable and are often receptive to change and innovation. 
You're obsessed with discovering new cultures, concepts, and opportunities, and are willing to challenge conventional norms and beliefs. Overall, those with an open personality bring a sense of wonder and enthusiasm to their interactions and endeavours. Thus, here is your recommendation list from Unveels based on having an Open Personality"
          score={78}
        />
        <PersonalitySection
          title="Neuroticism"
          description="Neuroticism , as a personality trait, reflects an individual's tendency to experience negative emotions such as anxiety, depression, and moodiness. People high in neuroticism may be more prone to worry, stress, and self-doubt, they often react strongly to perceived threats or challenges. Those low in neuroticism, on the other hand, tend to be more emotionally stable and resilient in the face of adversity. Thus, here's your bespoke recommendation list from Unveels based on your Neuroticism."
          score={46}
        />
        <PersonalitySection
          title="Agreeableness"
          description="People with an Agreeable personality reveal their kind-hearted and compassionate nature; characterized by a strong desire to maintain harmonious relationships. People, high in agreeableness, are often cooperative, empathetic, and considerate towards others; making them valuable team players and supportive friends. They prioritize the needs of others and are willing to go out of their way to help and support those around them. Their warm and nurturing behaviour makes them approachable and easy to get along with, fostering a sense of trust and camaraderie in their social interactions. In short, your agreeable personality is a key aspect of your character and it influences your interactions and relationships with others. Unveels has prepared a customized recommendation list based on your agreeable personality."
          score={58}
        />
        <PersonalitySection
          title="Extraversion"
          description="An extravert personality provides insights into an individual's social behaviour and interaction preferences. Extraverts are known for their outgoing, energetic, and talkative nature. They thrive in social settings, seek excitement, and enjoy being the center of attention. Extraverts are often described as sociable, assertive, and enthusiastic individuals who are comfortable in group settings and have a wide circle of friends. This also delves into the extraversion traits; highlighting that they're strong in communication, leadership, and relationship-building skills. Therefore, here's what Unveels suggests for you based on your Extraversion"
          score={58}
        />
        <PersonalitySection
          title="Conscientiousness"
          description="Conscientiousness is a key personality trait that reflects an individual's tendency to be organized, responsible, and goal-oriented. People high in conscientiousness are known for their reliability, diligence, and attention to detail; moreover, they're often diligent in their work, follow through on tasks, and are typically well-prepared. Unveels has unveiled the Conscientious side of your personality; and here's your recommended list based on it."
          score={58}
        />
      </div>
    </div>
  );
}

function PersonalitySection({
  title,
  description,
  score,
}: {
  title: string;
  description: string;
  score: number;
}) {
  // High -> 70% - 100%
  // Moderate -> above 40% - 69%
  // low -> 0% - 39%
  const scoreType = score < 40 ? "Low" : score < 70 ? "Moderate" : "High";
  return (
    <div className="py-5">
      <div className="flex items-center pb-6 space-x-2">
        <Icons.personalityTriangle className="size-8" />

        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>

      <span className="text-xl font-bold">Description</span>
      <p className="pt-1 pb-6 text-sm">{description}</p>

      <span className="text-xl font-bold">Score</span>
      <div
        className={clsx(
          "text-sm",
          score < 40
            ? "text-[#FF0000]"
            : score < 70
              ? "text-[#FAFF00]"
              : "text-[#5ED400]",
        )}
      >
        {scoreType} {score}%
      </div>
    </div>
  );
}

function RecommendationsTab() {
  const products = [
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Double Wear Stay-in-Place Foundation",
      brand: "Estée Lauder",
      price: 52,
      originalPrice: 60,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
  ];

  return (
    <div className="w-full px-4 py-8 overflow-auto">
      <div className="pb-14">
        <h2 className="pb-4 text-xl font-bold">Perfumes Recommendations</h2>
        <div className="flex w-full gap-4 overflow-x-auto">
          {products.map((product, index) => (
            <div key={index} className="w-[150px] rounded">
              <div className="relative h-[150px] w-[150px] overflow-hidden">
                <img
                  src={"https://picsum.photos/id/237/200/300"}
                  alt="Product"
                  className="object-cover rounded"
                />
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="w-full">
                  <h3 className="h-10 text-sm font-semibold text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[0.625rem] text-white/60">
                    {product.brand}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-x-1">
                  <span className="text-sm font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <Rating rating={4} />

              <div className="flex space-x-1">
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white text-[0.5rem] font-semibold"
                >
                  ADD TO CART
                </button>
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white bg-white text-[0.5rem] font-semibold text-black"
                >
                  SEE IMPROVEMENT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pb-14">
        <h2 className="text-xl font-bold">Look Recommendations</h2>
        <p className="pb-4 text-sm font-bold">
          A bold red lipstick and defined brows, mirror your strong, vibrant
          personality
        </p>
        <div className="flex w-full gap-4 overflow-x-auto">
          {products.map((product, index) => (
            <div key={index} className="w-[150px] rounded">
              <div className="relative h-[150px] w-[150px] overflow-hidden">
                <img
                  src={"https://picsum.photos/id/237/200/300"}
                  alt="Product"
                  className="object-cover rounded"
                />
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="w-full">
                  <h3 className="h-10 text-sm font-semibold text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[0.625rem] text-white/60">
                    {product.brand}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-x-1">
                  <span className="text-sm font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <Rating rating={4} />

              <div className="flex space-x-1">
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white text-[0.5rem] font-semibold"
                >
                  ADD TO CART
                </button>
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white bg-white text-[0.5rem] font-semibold text-black"
                >
                  SEE IMPROVEMENT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pb-14">
        <h2 className="text-xl font-bold">Lip Color Recommendations</h2>
        <p className="pb-4 text-sm font-bold">
          The best lip color for you are orange shades
        </p>
        <div className="flex w-full gap-4 overflow-x-auto">
          {products.map((product, index) => (
            <div key={index} className="w-[150px] rounded">
              <div className="relative h-[150px] w-[150px] overflow-hidden">
                <img
                  src={"https://picsum.photos/id/237/200/300"}
                  alt="Product"
                  className="object-cover rounded"
                />
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="w-full">
                  <h3 className="h-10 text-sm font-semibold text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[0.625rem] text-white/60">
                    {product.brand}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-x-1">
                  <span className="text-sm font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <Rating rating={4} />

              <div className="flex space-x-1">
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white text-[0.5rem] font-semibold"
                >
                  ADD TO CART
                </button>
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white bg-white text-[0.5rem] font-semibold text-black"
                >
                  SEE IMPROVEMENT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pb-14">
        <h2 className="pb-4 text-xl font-bold">Accessories Recommendations</h2>
        <div className="flex w-full gap-4 overflow-x-auto">
          {products.map((product, index) => (
            <div key={index} className="w-[150px] rounded">
              <div className="relative h-[150px] w-[150px] overflow-hidden">
                <img
                  src={"https://picsum.photos/id/237/200/300"}
                  alt="Product"
                  className="object-cover rounded"
                />
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="w-full">
                  <h3 className="h-10 text-sm font-semibold text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[0.625rem] text-white/60">
                    {product.brand}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-x-1">
                  <span className="text-sm font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <Rating rating={4} />

              <div className="flex space-x-1">
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white text-[0.5rem] font-semibold"
                >
                  ADD TO CART
                </button>
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white bg-white text-[0.5rem] font-semibold text-black"
                >
                  SEE IMPROVEMENT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function AttributesTab() {
  return (
    <div className="grid flex-1 grid-cols-1 gap-4 px-10 py-6 space-y-6 overflow-auto md:grid-cols-2">
      <FeatureSection
        icon={<Icons.face className="size-12" />}
        title="Face"
        features={[
          { name: "Face Shape", value: "Heart" },
          { name: "Skin Tone", value: "Dark latte" },
        ]}
      />
      <FeatureSection
        icon={<Icons.eye className="size-12" />}
        title="Eyes"
        features={[
          { name: "Eye Shape", value: "Almond" },
          { name: "Eye Size", value: "Big" },
          { name: "Eye Angle", value: "Hooded" },
          { name: "Eye Distance", value: "Wide-Set" },
          { name: "Eyelid", value: "Droopy" },
          { name: "Eye Color", value: "Green" },
        ]}
      />
      <FeatureSection
        icon={<Icons.brows className="size-12" />}
        title="Brows"
        features={[
          { name: "Eyebrow Shape", value: "Rounded" },
          { name: "Thickness", value: "Average" },
          { name: "Eyebrow Distance", value: "Average" },
          { name: "Eyebrow color", value: "", color: true },
        ]}
      />
      <FeatureSection
        icon={<Icons.lips className="size-12" />}
        title="Lips"
        features={[
          { name: "Lip shape", value: "Full" },
          { name: "Lip color", value: "", color: true },
        ]}
      />
      <FeatureSection
        icon={<Icons.cheekbones className="size-12" />}
        title="Cheekbones"
        features={[{ name: "cheekbones", value: "Flat cheekbones" }]}
      />
      <FeatureSection
        icon={<Icons.nose className="size-12" />}
        title="Nose"
        features={[{ name: "Nose Shape", value: "Broad" }]}
      />
      <FeatureSection
        icon={<Icons.hair className="size-12" />}
        title="Hair"
        features={[{ name: "Face Shape", value: "Heart" }]}
      />
    </div>
  );
}

function FeatureSection({
  icon,
  title,
  features,
}: {
  icon: ReactNode;
  title: string;
  features: { name: string; value: string; color?: boolean }[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center pb-5 space-x-2">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-3xl font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="">
            <div className="text-xl font-bold">{feature.name}</div>
            {feature.color ? (
              <div className="w-full h-6 bg-yellow-700"></div>
            ) : (
              <div className="text-sm">• {feature.value}</div>
            )}
          </div>
        ))}
      </div>
      <div className="py-4">
        <div className="border-b border-white/50"></div>
      </div>
    </div>
  );
}

function RecorderGuide() {
  return (
    <div className="px-2 pb-4 text-center text-white select-none">
      <p className="pb-9">
        Ensure it is a well-lit area with natural or bright artificial light
      </p>

      <div className="grid grid-cols-3 gap-5 text-xs text-white/50">
        <div className="flex items-center justify-between rounded-lg border border-dashed border-white/50 px-2.5 py-2">
          Face Position
          <ScanFace className="size-6" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white px-2.5 py-2 text-white [background:linear-gradient(90deg,_#CA9C43_0%,_#916E2B_27.4%,_#6A4F1B_59.4%,_#473209_100%);]">
          Lighting
          <Lightbulb className="size-6" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-dashed border-white/50 px-2.5 py-2">
          Orientation
          <Scan className="size-6" />
        </div>
      </div>
    </div>
  );
}

function Main() {
  return <RecorderGuide />;
}

function RecorderStatus() {
  const { isRecording, formattedTime, handleStartPause, handleStop, isPaused } =
    useRecordingControls();

  return (
    <div className="absolute inset-x-0 flex items-center justify-center gap-4 top-14">
      <button
        className="flex items-center justify-center size-8"
        onClick={handleStartPause}
      >
        {isPaused ? (
          <CirclePlay className="text-white size-6" />
        ) : isRecording ? (
          <PauseCircle className="text-white size-6" />
        ) : null}
      </button>
      <span className="relative flex size-4">
        {isRecording ? (
          <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
        ) : null}
        <span className="relative inline-flex bg-red-500 rounded-full size-4"></span>
      </span>
      <div className="font-serif text-white">{formattedTime}</div>
      <button
        className="flex items-center justify-center size-8"
        onClick={isRecording ? handleStop : handleStartPause}
      >
        {isRecording || isPaused ? (
          <StopCircle className="text-white size-6" />
        ) : (
          <CirclePlay className="text-white size-6" />
        )}
      </button>
    </div>
  );
}
