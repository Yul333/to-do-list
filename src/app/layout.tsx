import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
    title: "To-Do List",
    description: "A simple to-do list app built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}