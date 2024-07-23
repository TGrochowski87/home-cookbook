import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PageSwitch = () => {
  const [page, setPage] = useState<"recipes" | "shopping-lists">("recipes");
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${page}`);
  }, [page]);

  return (
    <Switch.Root
      className="page-switch floating interactive-element"
      checked={page === "shopping-lists"}
      onCheckedChange={() => setPage(prev => (prev === "recipes" ? "shopping-lists" : "recipes"))}>
      <div className="labels">
        <p>Przepisy</p>
        <p>Zakupy</p>
      </div>
      <Switch.Thumb className="switch-thumb" />
    </Switch.Root>
  );
};

export default PageSwitch;
