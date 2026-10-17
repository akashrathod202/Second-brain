 
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  type Theme = "dark" | "light";
  
  interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
  }
  
  const ThemeContext = createContext<ThemeContextType | null>(null);
  
  export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
      return localStorage.getItem("theme") === "light" ? "light" : "dark";
    });
  
    useEffect(() => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }, [theme]);
  
    const toggleTheme = () => {
      setTheme((current) => (current === "dark" ? "light" : "dark"));
    };
  
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export const useTheme = () => {
    const context = useContext(ThemeContext);
  
    if (!context) {
      throw new Error("useTheme must be used within ThemeProvider");
    }
  
    return context;
  };
  