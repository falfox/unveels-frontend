import { RecorderStatus, TopNavigation } from "../../components/assistant";
import { Icons } from "../../components/icons";

const MainContent = ({
  setScreen,
  onBack,
}: {
  setScreen: (screen: "vocal" | "text" | "audio") => void;
  onBack: () => void;
}) => {
  return (
    <div className="relative mx-auto flex h-full min-h-dvh w-full flex-col bg-black pt-20">
      <RecorderStatus />
      <TopNavigation onBack={onBack} />
      <div className="text-center font-extrabold text-white">
        How would you like to communicate with me today
      </div>

      <div className="space-y-4 p-3.5">
        <div className="rounded-3xl bg-[linear-gradient(90deg,rgba(202,156,67,0.2)_0%,rgba(145,110,43,0.2)_27.4%,rgba(106,79,27,0.2)_59.4%,rgba(71,50,9,0.2)_100%)] shadow-[4px_4px_15px_0px_#FFFFFF1A_inset]">
          <div className="flex w-full flex-col space-y-5 px-7 py-6 text-white lg:flex-row lg:px-16 lg:py-14">
            <div className="w-full space-y-5 lg:space-y-6">
              <div className="flex items-center space-x-2">
                <Icons.voiceDevices className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Vocal Connection</h3>
              </div>
              <p>
                Speak freely, and I'll respond in real-time. Let's talk Speech
                to Speech!
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] px-4 py-2.5 text-sm text-white lg:text-base"
              onClick={() => {
                setScreen("vocal");
              }}
            >
              Start Video Chat
            </button>
          </div>
        </div>
        <div className="rounded-3xl bg-[linear-gradient(90deg,rgba(202,156,67,0.2)_0%,rgba(145,110,43,0.2)_27.4%,rgba(106,79,27,0.2)_59.4%,rgba(71,50,9,0.2)_100%)] shadow-[4px_4px_15px_0px_#FFFFFF1A_inset]">
          <div className="flex w-full flex-col space-y-5 px-7 py-6 text-white lg:flex-row lg:px-16 lg:py-14">
            <div className="w-full space-y-5 lg:space-y-6">
              <div className="flex items-center space-x-2">
                <Icons.chatMessages className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Text Connection</h3>
              </div>
              <p>
                Prefer typing? Chat with me directly using text. I'm here to
                help!
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] px-4 py-2.5 text-sm text-white lg:text-base"
              onClick={() => {
                setScreen("text");
              }}
            >
              Start Text Chat
            </button>
          </div>
        </div>
        <div className="rounded-3xl bg-[linear-gradient(90deg,rgba(202,156,67,0.2)_0%,rgba(145,110,43,0.2)_27.4%,rgba(106,79,27,0.2)_59.4%,rgba(71,50,9,0.2)_100%)] shadow-[4px_4px_15px_0px_#FFFFFF1A_inset]">
          <div className="flex w-full flex-col space-y-5 px-7 py-6 text-white lg:flex-row lg:px-16 lg:py-14">
            <div className="w-full space-y-5 lg:space-y-6">
              <div className="flex items-center space-x-2">
                <Icons.userVoice className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Audible Assistance</h3>
              </div>
              <p>
                Prefer typing? Chat with me directly using text. I'm here to
                help!
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] px-4 py-2.5 text-sm text-white lg:text-base"
              onClick={() => {
                setScreen("audio");
              }}
            >
              Start Audio Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;