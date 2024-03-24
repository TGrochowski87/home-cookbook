import { PropsWithChildren } from "react";

interface BaseBlockProps extends PropsWithChildren {
  readonly className?: string;
  readonly cornersRounding?: "default" | "big";
  readonly disableShadow?: boolean;
}

const BaseBlock = ({ className, cornersRounding = "default", disableShadow = false, children }: BaseBlockProps) => {
  return (
    <div
      className={`block ${cornersRounding === "big" ? "big-rounding" : ""} ${
        disableShadow === false && "floating"
      } ${className}`}>
      {children}
    </div>
  );
};

export default BaseBlock;
