import { UploadIcon } from "@radix-ui/react-icons";
import Dropzone from "react-dropzone";
import placehoder from "assets/burger-placeholder.jpg";

interface ThumbnailSelectionProps {}

const ThumbnailSelection = ({}: ThumbnailSelectionProps) => {
  return (
    <div className="thumbnail-dropzone floating">
      <Dropzone
        maxSize={5242880} /// 5MB
        accept={{
          "image/jpeg": [],
          "image/png": [],
          "image/webp": [],
        }}>
        {({ getRootProps, getInputProps }) => (
          <div className="input-space" {...getRootProps()}>
            <input {...getInputProps()} />
            <UploadIcon />
          </div>
        )}
      </Dropzone>
      <img src={placehoder} />
    </div>
  );
};

export default ThumbnailSelection;
