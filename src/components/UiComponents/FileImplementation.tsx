import { useState } from "react";
import { UploadFile } from "./UploadFile";
import Image from "./Image";

const FileImplementation = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (imageSrc: string) => {
    console.log("🟡 Inside handleImageUpload: ", imageSrc);
    setSelectedImage(imageSrc);
  };

  return (
    <div>
      <UploadFile fileType="image" onImageUpload={handleImageUpload} />
      {/* Display the selected image if available */}
      {selectedImage && (
        <Image src={selectedImage} shape="rectangle" size="md" />
      )}
    </div>
  );
};

export default FileImplementation;
