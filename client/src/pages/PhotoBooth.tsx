import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { generateQrForStrip, startCaptureSequence } from "../helpers/helpers";
import { PhotoStripConfigurator } from "../components/PhotoStripConfigurator";
import {
  filters,
  frames,
  COUNT_STARTER,
  MAX_CAPTURES,
  COUNTDOWN_IMAGE_URLS,
  VIDEO_CONSTRAINTS,
} from "../constants/const";
import { PhotoStrip } from "../components/PhotoStrip";
import { CameraFlash } from "../components/CameraFlash";
import start from "../assets/envelope_card_final.png";
import Snowfall from "react-snowfall";
import arrow from "../assets/arrow.png";

const PhotoBooth: React.FC = () => {
  const stripRef = useRef(null);
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentCount, setCurrentCount] = useState(COUNT_STARTER);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [photoStripBgColor, setPhotoStripBgColor] = useState("--color-red");
  const [filter, setFilter] = useState<keyof typeof filters>("none");
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState<"black" | "white">("white");
  const [showDate, setShowDate] = useState(true);
  const [fontFamily, setFontFamily] = useState("cursive");
  const [frame, setFrame] = useState<keyof typeof frames>("none");

  const isInitialScreen = !isStarted && capturedImages.length === 0;
  const isCapturing = isStarted && capturedImages.length < MAX_CAPTURES;
  const isFinished = capturedImages.length === MAX_CAPTURES;

  const generateQrCode = async () => {
    setIsGeneratingQr(true);
    await generateQrForStrip({ stripRef, setQrCode });
    setIsGeneratingQr(false);
  };

  const restartPhotobooth = () => {
    setCapturedImages([]);
    setIsStarted(false);
    setCurrentCount(COUNT_STARTER);
    setQrCode(null);
    setPhotoStripBgColor("--color-red");
    setFilter("none");
    setCustomText("");
    setTextColor("white");
    setShowDate(true);
  };

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startPhotobooth = () => {
    setIsStarted(true);
    startCaptureSequence({
      setIsStarted,
      webcamRef,
      setCapturedImages,
      setCurrentCount,
    });
  };
  return (
    <div className="min-h-screen w-full p-4 flex flex-col items-center justify-center bg-background">
      {/* 1. CAPTURING STATE (Webcam only, full screen) */}
      {isCapturing && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
          <Webcam
            audio={false}
            ref={webcamRef}
            mirrored
            screenshotFormat="image/jpeg"
            videoConstraints={VIDEO_CONSTRAINTS}
            className="w-full h-auto max-w-full"
            style={{
              filter: filter === "greyscale" ? "contrast(150%)" : "none",
            }}
          />

          {/* Countdown Overlay */}
          {currentCount > 0 && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <img
                src={COUNTDOWN_IMAGE_URLS[currentCount]}
                alt={`Countdown ${currentCount}`}
                className="scale-25 animate-bounce"
              />
            </div>
          )}
          {
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <CameraFlash isFlashing={currentCount == 0} />
            </div>
          }
        </div>
      )}

      {/* 2. INITIAL OR FINISHED STATE (Split Screen) */}
      {!isCapturing && (
        <>
          {isInitialScreen ? (
            <div className="w-full h-full overflow-hidden flex flex-row items-center justify-center">
              <Snowfall color="#fff" snowflakeCount={200} radius={[0.5, 4.5]} />
              <div className="relative w-1/2">
                <img src={start} alt="start screen" className="w-fit h-fit" />
                <button
                  className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-12 cursor-pointer"
                  onClick={() => startPhotobooth()}
                >
                  <img
                    src={arrow}
                    alt="start button"
                    width={100}
                    height={100}
                  />
                </button>
              </div>

              {/* ensure webcam is loaded */}
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored
                screenshotFormat="image/jpeg"
                videoConstraints={VIDEO_CONSTRAINTS}
                className="absolute right-0 h-1 w-1 opacity-0"
              />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center justify-center gap-12">
              <Snowfall color="#fff" snowflakeCount={200} radius={[0.5, 4.5]} />
              <div className="w-full lg:w-1/2 flex justify-center">
                <PhotoStripConfigurator
                  stripRef={stripRef}
                  photoStripBgColor={photoStripBgColor}
                  setPhotoStripBgColor={setPhotoStripBgColor}
                  filter={filter}
                  setFilter={setFilter}
                  customText={customText}
                  setCustomText={setCustomText}
                  textColor={textColor}
                  setTextColor={setTextColor}
                  showDate={showDate}
                  setShowDate={setShowDate}
                  generateQrCode={generateQrCode}
                  isGeneratingQr={isGeneratingQr}
                  qrCode={qrCode}
                  fontFamily={fontFamily}
                  setFontFamily={setFontFamily}
                  frame={frame}
                  setFrame={setFrame}
                />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                <PhotoStrip
                  stripRef={stripRef}
                  capturedImages={capturedImages}
                  photoStripBgColor={photoStripBgColor}
                  filter={filter}
                  customText={customText}
                  textColor={textColor}
                  showDate={showDate}
                  todayDate={todayDate}
                  fontFamily={fontFamily}
                  frame={frame}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Back Button */}
      {isFinished && (
        <button
          className="fixed bottom-8 left-8 back-button"
          onClick={restartPhotobooth}
        >
          ← Go Back
        </button>
      )}
    </div>
  );
};

export default PhotoBooth;
