import * as Switch from "@radix-ui/react-switch";
import { useLocation, useNavigate } from "react-router-dom";

const PageSwitch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Switch.Root
      className="page-switch floating interactive-element"
      checked={location.pathname.includes("shopping-lists")}
      onCheckedChange={() =>
        navigate(`/${location.pathname.includes("shopping-lists") ? "recipes" : "shopping-lists"}`)
      }>
      <div className="labels">
        <p>Recipes</p>
        <p>Shopping</p>
      </div>
      <Switch.Thumb className="switch-thumb" />
    </Switch.Root>
  );
};

export default PageSwitch;
