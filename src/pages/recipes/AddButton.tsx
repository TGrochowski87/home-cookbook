import CustomButton from "components/CustomButton";

interface AddButtonProps {
  readonly onClick: () => void;
}

const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <CustomButton className="add-button floating" type="filled" onClick={onClick}>
      <svg width="100%" height="100%">
        <rect fill="whitesmoke" width={8} height="100%" x="50%" transform="translate(-4, 0)" />
        <rect fill="whitesmoke" width="100%" height={8} y="50%" transform="translate(0, -4)" />
      </svg>
    </CustomButton>
  );
};

export default AddButton;
