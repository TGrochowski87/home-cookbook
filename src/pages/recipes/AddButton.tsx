import Button from "components/Button";
import PlusIcon from "components/PlusIcon";

interface AddButtonProps {
  readonly onClick: () => void;
}

const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <Button className="add-button floating" type="filled" onClick={onClick}>
      <PlusIcon thickness={8} />
    </Button>
  );
};

export default AddButton;
