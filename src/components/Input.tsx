import "./styles.less";

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const Input = ({ placeholder, className, ...other }: InputProps) => {
  return <input placeholder={placeholder} className={`input floating ${className ? className : ""}`} {...other} />;
};

export default Input;
