import Button from "components/Button";
import { ChevronUp } from "lucide-react";

interface ScrollUpButtonProps {
  readonly hidden?: boolean;
}

const ScrollUpButton = ({ hidden = false }: ScrollUpButtonProps) => {
  return (
    <Button
      className={`scrollup-button floating ${hidden ? "hidden" : ""}`}
      type="filled"
      shape="round"
      onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}>
      <ChevronUp width="100%" height="100%" />
    </Button>
  );
};

export default ScrollUpButton;
