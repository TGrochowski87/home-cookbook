import { Outlet, useNavigation } from "react-router-dom";
import "./App.less";
import { useCallback, useLayoutEffect, useState } from "react";
import { ThemeContext } from "storage/context/ThemeContext";
import LoadingIndicator from "components/LoadingIndicator";

function App() {
  const navigation = useNavigation();
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
    const defaultDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (defaultDarkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const switchTheme = useCallback(() => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  }, [setTheme]);

  /**
   * Loading indicator does not show when starting the website, because childrens' loaders are run before anything renders.
   * TODO: Maybe handle this in the future, but it does not seem important.
   */
  return (
    <div className="app">
      <ThemeContext.Provider value={{ theme, switchTheme }}>
        <div className={`navigation-loading-overlay ${navigation.state === "loading" ? "" : "hidden"}`}>
          <LoadingIndicator />
        </div>
        <Outlet />
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
