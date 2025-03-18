"use client"

import { createContext, useContext, useEffect, useState } from "react";


//context with default values
const ThemeContext = createContext({
    theme: "dark",
    toggleTheme: () => {},
});
//wraps app and provides theme functionality
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState("dark");

    //update the HTML attribute when theme changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
