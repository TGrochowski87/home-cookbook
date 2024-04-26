import { PropsWithChildren } from "react";

type Type = "outlined" | "filled";

const typesStyles: Record<Type, string> = {
  filled: "button-filled",
  outlined: "button-outlined",
};

interface ButtonProps extends PropsWithChildren {
  readonly type?: Type;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly disableShadow?: boolean;
}

const Button = ({ onClick, children, disableShadow, className, type = "outlined" }: ButtonProps) => {
  return (
    <button
      className={`${typesStyles[type]} ${disableShadow ? "" : "floating"} ${className}`}
      type="button"
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
