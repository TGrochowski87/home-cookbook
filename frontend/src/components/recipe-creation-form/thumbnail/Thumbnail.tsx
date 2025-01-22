import ThumbnailSelection from "./ThumbnailSelection";
import { useState } from "react";
import { ErrorCode as FileUploadError } from "react-dropzone";
import "./styles.less";
import { CircleX } from "lucide-react";

const errorMessages: Record<FileUploadError, string> = {
  "file-invalid-type": "Unsupported file format.",
  "file-too-large": "The file is too large. The maximum size is 3MB.",
  "too-many-files": "Selected more than one file.",
  "file-too-small": "The file is too small.",
};

interface ThumbnailProps {
  readonly image: Blob | null;
  readonly setImage: (image: Blob | null) => void;
}

const Thumbnail = ({ image, setImage }: ThumbnailProps) => {
  const [fileUploadErrors, setFileUploadErrors] = useState<FileUploadError[]>([]);

  return (
    <div className="thumbnail-space">
      <div className="thumbnail-dropzone floating">
        {image ? (
          <>
            <img src={URL.createObjectURL(image as Blob)} />
            <button className="discard-button" type="button" onClick={() => setImage(null)}>
              <CircleX />
            </button>
          </>
        ) : (
          <ThumbnailSelection setImage={setImage} setFileUploadErrors={setFileUploadErrors} />
        )}
      </div>
      <p className="error-message">{fileUploadErrors.map(error => `${errorMessages[error]}\n`)}</p>
    </div>
  );
};

export default Thumbnail;
