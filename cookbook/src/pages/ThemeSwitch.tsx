import Button from "components/Button";
import { Moon, Sun } from "lucide-react";
import { useState, useLayoutEffect } from "react";

interface ThemeButtonProps {}

const ThemeSwitch = ({}: ThemeButtonProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useLayoutEffect(() => {
    const body = document.getElementsByTagName("body");
    body[0].classList.remove("light");
    body[0].classList.remove("dark");
    body[0].classList.add(theme);
  }, [theme]);

  /**
   * Choose the default based on the browser preference setting.
   * useLayoutEffect as it needs to happen before the first render.
   */
  useLayoutEffect(() => {
    let defaultDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (defaultDarkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  return (
    <Button
      className="floating theme-button"
      type="filled"
      onClick={() => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }}>
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
};

export default ThemeSwitch;
