import { Icons } from "../../components/icons";
import { RecordDialog } from "../../components/record-dialog";
import SwirlyBackground from "../../assets/swirly-background.svg";
import { TopNavigation } from "../../components/assistant";

const WelcomeScreen = ({ onStarted }: { onStarted: () => void }) => {
  return (
    <div className="relative mx-auto flex h-full min-h-dvh w-full flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="w-[1700px] -translate-x-[350px] -translate-y-[900px]">
          <img
            src={SwirlyBackground}
            alt="Assistant"
            className="h-auto object-cover"
          />
        </div>
      </div>
      <TopNavigation />
      <div className="flex h-full flex-1 flex-col items-start justify-center px-4">
        <Icons.logo className="size-20" />

        <p className="text-[2.125rem] text-white">
          Welcome to{" "}
          <span className="inline-block bg-[linear-gradient(90deg,#CA9C43_36.41%,#916E2B_46.74%,#6A4F1B_58.8%,#473209_74.11%)] bg-clip-text text-transparent">
            Sarah
          </span>
          , Your Virtual Shopping Assistant
        </p>

        <p className="pt-4 text-white">
          Hello and welcome! I’m Sarah, here to assist you with all your
          shopping needs.
        </p>
      </div>

      <div className="w-full px-8 pb-14">
        <RecordDialog
          onConfirm={() => {
            onStarted();
          }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] p-4 text-white"
          >
            Start
          </button>
        </RecordDialog>
      </div>
    </div>
  );
};

export default WelcomeScreen;
