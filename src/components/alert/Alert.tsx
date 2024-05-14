import { CircleAlert } from "lucide-react";

export type AlertType = "error";

interface AlertProps {
  readonly type: AlertType;
  readonly message: string;
}

const Alert = ({ type, message }: AlertProps) => {
  return (
    <div className={`alert ${type}`}>
      <CircleAlert width={20} height={20} />
      <p>{message}</p>
    </div>
  );
};

export default Alert;
