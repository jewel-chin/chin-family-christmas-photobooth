import PixelsImage from "react-pixels";

type Props = {
  stripRef: React.RefObject<HTMLDivElement | null>;
  photoStripBgColor: string;
  capturedImages: string[];
  filter: keyof typeof import("../constants/const").filters;
  textColor: "black" | "white";
  customText: string;
  showDate: boolean;
  todayDate: string;
  fontFamily: string;
  frame: string;
};

export const PhotoStrip = ({
  stripRef,
  photoStripBgColor,
  capturedImages,
  filter,
  textColor,
  customText,
  showDate,
  todayDate,
  fontFamily,
  frame,
}: Props) => {
  const DefaultPhotoStrip = () => (
    <div
      ref={stripRef}
      className="custom-photobooth-strip"
      style={{
        backgroundColor: photoStripBgColor,
      }}
    >
      {capturedImages.map((imgSrc, index) => (
        <PixelsImage
          key={index}
          src={imgSrc}
          style={{
            filter: filter === "greyscale" ? "contrast(150%)" : "none",
          }}
          filter={filter}
          className="w-1/2"
        />
      ))}
      <div className="flex flex-col items-center mt-4 gap-2 w-full">
        <span
          style={{ fontFamily: fontFamily }}
          className={`photo-strip-text text-md w-full ${
            textColor === "white" ? "text-white" : "text-black"
          }`}
        >
          {customText}
        </span>
        {showDate && (
          <span
            style={{ fontFamily: fontFamily }}
            className={`photo-strip-text text-sm ${
              textColor === "white" ? "text-white" : "text-black"
            }`}
          >
            {todayDate}
          </span>
        )}
      </div>
    </div>
  );

  const CustomFrameStrip = () => (
    <div
      ref={stripRef}
      className="relative inline-grid place-items-center w-[500px] h-[500px]"
    >
      {/* Images */}
      <div className="custom-frame-photobooth-strip z-10">
        {capturedImages.map((imgSrc, index) => (
          <PixelsImage
            key={index}
            src={imgSrc}
            className="w-[200px] h-[115px]"
            filter={filter}
          />
        ))}
      </div>

      {/* Frame */}
      {frame && (
        <img
          src={frame}
          className="z-20 object-contain w-full h-full pointer-events-none absolute"
          alt="frame overlay"
        />
      )}
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {frame !== "none" ? <CustomFrameStrip /> : <DefaultPhotoStrip />}
    </div>
  );
};
