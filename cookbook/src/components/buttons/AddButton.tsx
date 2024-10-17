import Button from "components/buttons/Button";
import "./styles.less";
import { Plus } from "lucide-react";

interface AddButtonProps {
  readonly onClick: () => void;
}

const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <Button className="add-button floating" type="filled" onClick={onClick}>
      <Plus width="100%" height="100%" />
    </Button>
  );
};

export default AddButton;
