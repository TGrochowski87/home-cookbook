interface ContentWidthInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  readonly minWidth?: string;
}

const WidthAdjustingInput = ({ minWidth, ...other }: ContentWidthInputProps) => {
  return (
    <span className="input-sizing-wrapper">
      <p style={{ minWidth: minWidth }}>{other.value}</p>
      <input {...other} />
    </span>
  );
};

export default WidthAdjustingInput;
