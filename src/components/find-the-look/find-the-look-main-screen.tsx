import { useRef, useState } from "react";
import { RecorderStatus, TopNavigation } from "../../components/assistant";
import { Icons } from "../../components/icons";

export function FindTheLookMainScreen() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Refs for the file inputs
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const snapshotUploadRef = useRef<HTMLInputElement>(null);
  const videoUploadRef = useRef<HTMLInputElement>(null);

  // Function to toggle active sections
  const handleSectionClick = (
    section: "liveCamera" | "takeSnapshot" | "uploadPhotoOrVideo",
  ) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Function to handle image upload
  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      console.log("Image uploaded:", file);
      // Additional logic to send file to server can be added here
    }
  };

  // Function to handle video upload
  const handleUploadVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      console.log("Video uploaded:", file);
      // Additional logic to send file to server can be added here
    }
  };

  return (
    <div className="relative mx-auto flex h-full min-h-dvh w-full flex-col bg-black pt-20">
      <RecorderStatus />
      <TopNavigation />
      <div className="px-4 text-center font-extrabold text-white xl:text-start xl:text-2xl">
        How do you want to find the look
      </div>

      <div className="space-y-4 p-3.5">
        {/* Section Live Camera */}
        <div
          className="rounded-3xl bg-[#252525] p-7 text-white shadow-[inset_5.2px_5.2px_19.5px_rgba(255,255,255,0.1)] lg:p-16"
          onClick={() => handleSectionClick("liveCamera")}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-5 lg:w-2/3">
              <div className="flex items-center space-x-2">
                <Icons.liveCamera className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Live Camera</h3>
              </div>
              <p>
                Capture the essence of elegance in real-time with our live
                camera feature.
              </p>
              {activeSection === "liveCamera" && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gradient-to-b from-[#473209] to-[#CA9C43] bg-clip-text text-transparent">
                      ▼
                    </span>
                    <h4 className="font-semibold">Steps to Follow</h4>
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-white">
                    <li>Hold the camera parallel to the face...</li>
                    <li>Ensure the entire face is centered in the frame.</li>
                    <li>Position the camera at eye level with the face.</li>
                    <li>Keep the camera steady and avoid tilting.</li>
                    <li>Ensure the area is well-lit for clear detection.</li>
                    <li>
                      Avoid shadows on the face by using soft, even lighting.
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {activeSection === "liveCamera" && (
              <div>
                <input
                  ref={imageUploadRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleUploadImage}
                />
                <button
                  onClick={() => imageUploadRef.current?.click()}
                  className="mt-6 w-full bg-gradient-to-r from-[#473209] to-[#CA9C43] px-40 py-3 font-semibold text-white shadow-lg lg:w-auto"
                >
                  USE LIVE CAMERA
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Take a Snapshot */}
        <div
          className="rounded-3xl bg-[#252525] p-7 text-white shadow-[inset_5.2px_5.2px_19.5px_rgba(255,255,255,0.1)] lg:p-16"
          onClick={() => handleSectionClick("takeSnapshot")}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-5 lg:w-2/3">
              <div className="flex items-center space-x-2">
                <Icons.takeSnapshot className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Take a Snapshot</h3>
              </div>
              <p>
                Unveil the potential of your favorite images with our photo
                upload feature.
              </p>
              {activeSection === "takeSnapshot" && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gradient-to-b from-[#473209] to-[#CA9C43] bg-clip-text text-transparent">
                      ▼
                    </span>
                    <h4 className="font-semibold">Steps to Follow</h4>
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-white">
                    <li>
                      Take a clear, high-resolution photo for the best results.
                    </li>
                    <li>
                      Make sure the entire upper body is visible in the photo.
                    </li>
                    <li>
                      Take a photo with even lighting and minimal shadows.
                    </li>
                    <li>
                      Ensure the photo contains only one individual for accurate
                      analysis.
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {activeSection === "takeSnapshot" && (
              <div>
                <input
                  ref={snapshotUploadRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleUploadImage}
                />
                <button
                  onClick={() => snapshotUploadRef.current?.click()}
                  className="mt-6 w-full bg-gradient-to-r from-[#473209] to-[#CA9C43] px-40 py-3 font-semibold text-white shadow-lg lg:w-auto"
                >
                  UPLOAD PHOTO
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Upload Photo or Video */}
        <div
          className="rounded-3xl bg-[#252525] p-7 text-white shadow-[inset_5.2px_5.2px_19.5px_rgba(255,255,255,0.1)] lg:p-16"
          onClick={() => handleSectionClick("uploadPhotoOrVideo")}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-5 lg:w-2/3">
              <div className="flex items-center space-x-2">
                <Icons.uploadPhotoOrVideo className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Upload Photo Or Video</h3>
              </div>
              <p>
                Immerse yourself in the luxury of transformation with our video
                upload feature.
              </p>
              {activeSection === "uploadPhotoOrVideo" && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gradient-to-b from-[#473209] to-[#CA9C43] bg-clip-text text-transparent">
                      ▼
                    </span>
                    <h4 className="font-semibold">Steps to Follow</h4>
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-white">
                    <li>
                      Choose a high-quality photo or video for upper body only.
                    </li>
                    <li>Ensure the photo or video is stable and not shaky.</li>
                    <li>Make sure the entire look is visible.</li>
                    <li>
                      Opt for a photo or video with bright, even lighting and
                      minimal shadows.
                    </li>
                    <li>
                      Ensure the photo or video contains only one individual for
                      precise detection.
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {activeSection === "uploadPhotoOrVideo" && (
              <div>
                <input
                  ref={videoUploadRef}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleUploadVideo}
                />
                <button
                  onClick={() => videoUploadRef.current?.click()}
                  className="mt-6 w-full bg-gradient-to-r from-[#473209] to-[#CA9C43] px-40 py-3 font-semibold text-white shadow-lg lg:w-auto"
                >
                  UPLOAD PHOTO/VIDEO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
