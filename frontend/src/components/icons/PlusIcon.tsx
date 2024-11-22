interface PlusIconProps {
  readonly width?: string;
  readonly height?: string;
  readonly thickness?: number;
}

// TODO: This might not be needed actually. Can be changed to lucide icon.
const PlusIcon = ({ width = "100%", height = "100%", thickness = 4 }: PlusIconProps) => {
  return (
    <svg width={width} height={height}>
      <rect width={thickness} height="100%" x="50%" transform={`translate(-${thickness / 2}, 0)`} />
      <rect width="100%" height={thickness} y="50%" transform={`translate(0, -${thickness / 2})`} />
    </svg>
  );
};

export default PlusIcon;
