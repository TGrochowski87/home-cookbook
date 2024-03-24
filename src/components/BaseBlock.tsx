interface BaseBlockProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  readonly cornersRounding?: "default" | "big";
  readonly disableShadow?: boolean;
}

const BaseBlock = ({
  className,
  cornersRounding = "default",
  disableShadow = false,
  children,
  ...others
}: BaseBlockProps) => {
  return (
    <div
      className={`block ${cornersRounding === "big" ? "big-rounding" : ""} ${
        disableShadow === false && "floating"
      } ${className}`}
      {...others}>
      {children}
    </div>
  );
};

export default BaseBlock;
