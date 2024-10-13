import Button from "components/buttons/Button";
import PlusIcon from "components/icons/PlusIcon";
import "../styles.less";

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
