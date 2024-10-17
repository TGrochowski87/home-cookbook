import { PropsWithChildren } from "react";
import "./styles.less";

type Type = "outlined" | "filled";
type Shape = "rounded-square" | "round";

interface ButtonProps extends PropsWithChildren {
  readonly type?: Type;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly disableShadow?: boolean;
  readonly shape?: Shape;
}

const Button = ({
  onClick,
  children,
  disableShadow,
  className,
  type = "outlined",
  shape = "rounded-square",
}: ButtonProps) => {
  return (
    <button
      className={`button-${type} button-shape-${shape} ${disableShadow ? "" : "floating"} ${className}`}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
