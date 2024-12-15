import { ThemeContext } from "storage/context/ThemeContext";
import Button from "components/buttons/Button";
import { Moon, Sun } from "lucide-react";
import { useContext } from "react";

const ThemeSwitch = () => {
  const { theme, switchTheme } = useContext(ThemeContext);

  return (
    <Button className="floating theme-button" type="filled" onClick={switchTheme}>
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
};

export default ThemeSwitch;
