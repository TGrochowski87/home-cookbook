import placehoder from "assets/burger-placeholder.jpg";
import ThumbnailSelection from "./ThumbnailSelection";
import { useState } from "react";
import { ErrorCode as FileUploadError } from "react-dropzone";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import "./styles.less";

const errorMessages: Record<FileUploadError, string> = {
  "file-invalid-type": "Nieobsługiwany format pliku.",
  "file-too-large": "Plik jest za duży. Musi być mniejszy niż 5MB.",
  "too-many-files": "Wysłano więcej niż jeden plik.",
  "file-too-small": "Plik jest za mały.",
};

interface ThumbnailProps {
  readonly image: Blob | undefined;
  readonly setImage: (image: Blob | undefined) => void;
}

const Thumbnail = ({ image, setImage }: ThumbnailProps) => {
  const [fileUploadErrors, setFileUploadErrors] = useState<FileUploadError[]>([]);

  return (
    <div className="thumbnail-space">
      <div className="thumbnail-dropzone floating">
        {image ? (
          <>
            <img src={URL.createObjectURL(image as Blob) ?? placehoder} />
            <button className="discard-button" type="button" onClick={() => setImage(undefined)}>
              <CrossCircledIcon />
            </button>
          </>
        ) : (
          <>
            <ThumbnailSelection setImage={setImage} setFileUploadErrors={setFileUploadErrors} />
            <img className="placeholder" src={placehoder} />
          </>
        )}
      </div>
      <p>{fileUploadErrors.map(error => `${errorMessages[error]}\n`)}</p>
    </div>
  );
};

export default Thumbnail;
