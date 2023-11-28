import React, { ChangeEvent } from "react";
import { UploadIcon } from "./Icons";

interface UploadFileProps {
  fileType?: "image" | "pdf" | "both";
  onImageUpload: (imageSrc: string) => void;
  snapshot?: boolean;
}

export const UploadFile: React.FC<UploadFileProps> = ({
  fileType = "image",
  onImageUpload,
}) => {

  
  const acceptedFileTypes =
    fileType === "both"
      ? ".svg, .png, .jpg, .jpeg, .gif, .pdf"
      : fileType === "pdf"
      ? ".pdf"
      : ".svg, .png, .jpg, .jpeg, .gif";

  const fileTypeName =
    fileType === "both"
      ? "SVG, PNG, JPG, JPEG, GIF, or PDF"
      : fileType === "pdf"
      ? "PDF"
      : "SVG, PNG, JPG, JPEG, or GIF";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onImageUpload("lezgoo");
    console.log("File: ", file?.type);
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            const imageSrc = event.target.result as string;
            console.log("ImageSrc: ", imageSrc);
          }
        };

        reader.readAsDataURL(file);
      } else {
        // Handle the case where a non-image file is selected
        console.log("Selected file is not an image.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 "
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-4">
          <UploadIcon size="w-12 h-12" color="text-gray-500" />
          <div className="text-center">
            <p className="mb-2 text-lg text-gray-500 font-semibold">
              Click to upload
            </p>
            <p className="text-base text-gray-500">
              {fileType === "both" ? "File" : "Files"} accepted: {fileTypeName}
            </p>
          </div>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
