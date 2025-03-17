"use client";

import { useTheme } from "@/context/ThemeContext";

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} style={{ padding: "10px", cursor: "pointer" }}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
    );
};

export default DarkModeToggle;
