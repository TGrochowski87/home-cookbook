import { forwardRef } from "react";
import "./styles.less";

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ placeholder, className, ...other }: InputProps, ref) => {
  return (
    <input {...other} ref={ref} placeholder={placeholder} className={`input floating ${className ? className : ""}`} />
  );
});

export default Input;
