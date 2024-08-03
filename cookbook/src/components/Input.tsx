import { forwardRef } from "react";
import "./styles.less";

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  readonly disableShadow?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ disableShadow, placeholder, className, ...other }: InputProps, ref) => {
    return (
      <input
        {...other}
        ref={ref}
        placeholder={placeholder}
        className={`input ${disableShadow ? "" : "floating"} ${className ? className : ""}`}
      />
    );
  }
);

export default Input;
