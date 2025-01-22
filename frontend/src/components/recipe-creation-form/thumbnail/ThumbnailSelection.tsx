import Dropzone, { FileRejection } from "react-dropzone";
import "./styles.less";

import { ErrorCode as FileUploadError } from "react-dropzone";
import { Upload } from "lucide-react";

interface ThumbnailSelectionProps {
  readonly setImage: (image: Blob) => void;
  readonly setFileUploadErrors: React.Dispatch<React.SetStateAction<FileUploadError[]>>;
}

const ThumbnailSelection = ({ setImage, setFileUploadErrors }: ThumbnailSelectionProps) => {
  return (
    <Dropzone
      onDropAccepted={<T extends File>(files: T[]) => {
        setFileUploadErrors([]);
        setImage(files[0]);
      }}
      onDropRejected={(fileRejections: FileRejection[]) => {
        const errorCodes = fileRejections.map(fr => fr.errors.map(e => e.code as FileUploadError)).flat();
        setFileUploadErrors(errorCodes);
      }}
      maxSize={3145728} /// 3MB
      maxFiles={1}
      multiple={false}
      accept={{
        "image/jpeg": [],
        "image/png": [],
        "image/webp": [],
      }}>
      {({ getRootProps, getInputProps }) => (
        <div className="input-space" {...getRootProps()}>
          <input {...getInputProps()} />
          <Upload />
          <p>include photo</p>
        </div>
      )}
    </Dropzone>
  );
};

export default ThumbnailSelection;
