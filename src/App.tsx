import { Outlet } from "react-router-dom";
import "./App.less";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
// import "@radix-ui/colors";

function App() {
  // TODO: Likely temporary. Remove later.
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const body = document.getElementsByTagName("body");
    body[0].classList.remove("light");
    body[0].classList.remove("dark");
    body[0].classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const test = (event: UIEvent) => {
      console.log(navigator.virtualKeyboard);
    };

    window.addEventListener("resize", test);

    return () => {
      window.removeEventListener("resize", test);
    };
  }, []);

  return (
    <div className="app">
      <button
        onClick={() => {
          setTheme(prev => (prev === "light" ? "dark" : "light"));
        }}
        style={{ position: "absolute", top: "8px", right: "8px", width: "24px", height: "24px" }}>
        <Palette width={16} height={16} x="50%" y="50%" transform="translate(-4, 0)" />
      </button>
      <Outlet />
    </div>
  );
}

export default App;

