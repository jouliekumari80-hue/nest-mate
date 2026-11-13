import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
