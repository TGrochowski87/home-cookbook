import { PropsWithChildren } from "react";

type Type = "outlined" | "filled";

const typesStyles: Record<Type, string> = {
  filled: "button-filled",
  outlined: "button-outlined",
};

interface CustomButtonProps extends PropsWithChildren {
  readonly type?: Type;
  readonly onClick?: () => void;
  readonly className?: string;
}

const CustomButton = ({ onClick, children, className, type = "outlined" }: CustomButtonProps) => {
  return (
    <button className={`${typesStyles[type]} ${className}`} type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomButton;
