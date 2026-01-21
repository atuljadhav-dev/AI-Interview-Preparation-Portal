"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };
    return (
        <button
            onClick={() => toggleTheme()}
            className="p-2 w-10  h-10  rounded-full mx-auto bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Theme">
            {resolvedTheme === "dark" ? (
                // Sun Icon
                <Sun />
            ) : (
                // Moon Icon
                <Moon />
            )}
        </button>
    );
};

export default ThemeToggle;
