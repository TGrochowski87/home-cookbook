interface BaseBlockProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  readonly disableShadow?: boolean;
}

const BaseBlock = ({ className, disableShadow = false, children, ...others }: BaseBlockProps) => {
  return (
    <div className={`block  ${disableShadow === false ? "floating" : ""} ${className}`} {...others}>
      {children}
    </div>
  );
};

export default BaseBlock;
