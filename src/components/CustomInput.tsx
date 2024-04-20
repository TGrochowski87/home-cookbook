import "./styles.less";

interface CustomInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const CustomInput = (props: CustomInputProps) => {
  return <input placeholder={props.placeholder} className="input floating" {...props} />;
};

export default CustomInput;
