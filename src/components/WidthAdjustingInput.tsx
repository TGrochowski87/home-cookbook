interface ContentWidthInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const WidthAdjustingInput = (props: ContentWidthInputProps) => {
  return (
    <span className="input-sizing-wrapper">
      <p>{props.value}</p>
      <input {...props} />
    </span>
  );
};

export default WidthAdjustingInput;
