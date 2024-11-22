import Button from "components/buttons/Button";
import { Home } from "lucide-react";
import "./styles.less";
import { useNavigate } from "react-router-dom";

interface HomeButtonProps {
  readonly homeTab: "recipes" | "shopping-lists";
}

const HomeButton = ({ homeTab }: HomeButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      className="home-button floating"
      type="filled"
      onClick={() => {
        navigate(`/${homeTab}`);
      }}>
      <Home />
    </Button>
  );
};

export default HomeButton;
