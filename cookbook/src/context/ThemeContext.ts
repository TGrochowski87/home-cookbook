import { createContext } from "react";

export interface ThemeContextProps {
  theme: "light" | "dark";
  switchTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  switchTheme: () => {},
});
