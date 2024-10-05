import clsx from "clsx";
import { Download, X } from "lucide-react";
import React from "react";
import { Icons } from "./icons";

interface ShareOptionProps {
  icon: React.ReactNode | string;
  label: string;
  className: string;
  textColor?: string;
}

export function ShareModal() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/20 backdrop-blur-3xl">
      <div className="w-full rounded-xl bg-[#1c1c1e]">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-sm text-white">Send to</h2>
          <button type="button" className="text-white">
            <X className="size-6" />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4 px-6 py-4">
          <ShareOption
            icon={<Download />}
            label="Save to gallery"
            className="text-black bg-white"
          />
          <ShareOption
            icon={<Icons.facebook />}
            label="Facebook"
            className="bg-[#1877f2] text-white"
          />
          <ShareOption
            icon={<Icons.instagram />}
            label="Instagram"
            className="bg-[linear-gradient(45deg,#FAAD4F_14.61%,#DD2A7B_39.38%,#9537B0_58.49%,#515BD4_85.39%)] text-white"
          />
          <ShareOption
            icon={<Icons.tiktok />}
            label="TikTok"
            className="bg-black"
          />
          <ShareOption
            icon={<Icons.messenger />}
            label="Messenger"
            className="bg-[linear-gradient(45deg,#0498FA_14.61%,#5C5EFE_38.67%,#F44E90_66.28%,#FA8679_85.39%)] text-white"
          />
        </div>
      </div>
    </div>
  );
}

function ShareOption({ icon, label, className }: ShareOptionProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx(
          className,
          "mb-2 flex size-14 items-center justify-center rounded-full",
        )}
      >
        {typeof icon === "string" ? (
          <span className={`size-8 text-2xl font-bold`}>{icon}</span>
        ) : (
          React.cloneElement(icon as React.ReactElement, {
            className: "size-8",
          })
        )}
      </div>
      <span className="text-xs text-center text-white">{label}</span>
    </div>
  );
}
