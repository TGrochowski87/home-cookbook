interface ContentWidthInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  minWidth?: string;
}

const WidthAdjustingInput = (props: ContentWidthInputProps) => {
  return (
    <span className="input-sizing-wrapper">
      <p style={{ minWidth: props.minWidth }}>{props.value}</p>
      <input {...props} />
    </span>
  );
};

export default WidthAdjustingInput;
