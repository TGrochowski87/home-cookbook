import { PropsWithChildren } from "react";

interface ButtonOutlinedProps extends PropsWithChildren {
  readonly onClick?: () => void;
}

const ButtonOutlined = ({ onClick, children }: ButtonOutlinedProps) => {
  return (
    <button className="button-outlined" type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonOutlined;
