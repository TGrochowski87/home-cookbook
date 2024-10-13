import { ThemeContext } from "context/ThemeContext";
import Button from "components/Button";
import { Moon, Sun } from "lucide-react";
import { useContext } from "react";

interface ThemeButtonProps {}

const ThemeSwitch = ({}: ThemeButtonProps) => {
  const { theme, switchTheme } = useContext(ThemeContext);

  return (
    <Button className="floating theme-button" type="filled" onClick={switchTheme}>
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
};

export default ThemeSwitch;
