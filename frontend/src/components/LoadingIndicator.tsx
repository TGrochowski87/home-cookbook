import { SyncLoader } from "react-spinners";
import "./styles.less";

interface LoadingIndicatorProps {
  readonly className?: string;
}

const LoadingIndicator = ({ className }: LoadingIndicatorProps) => {
  return (
    <SyncLoader
      size={12}
      margin={4}
      speedMultiplier={0.5}
      color="var(--grass-9)"
      className={`loading-indicator ${className}`}
    />
  );
};

export default LoadingIndicator;
