"use client"; // Required for Context Providers

import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/hooks/useUser"; 

export function Providers({ children }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserProvider>{children}</UserProvider>
        </ThemeProvider>
    );
}
