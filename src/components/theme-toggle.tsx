"use client"

import { LucideMoon, LucideSun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function ThemeToggle() {
    const [mounted, setMounted] = useState<boolean>(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <div className="relative inline-flex cursor-pointer select-none items-center gap-2">
            <h1 className="text-gray-500 text-xs font-semibold transition-opacity duration-300 dark:text-gray-400">Dark Mode</h1>
            <div className={`h-5 w-10 rounded-full transition-colors duration-200 ease-in-out ${theme === "dark" ? "bg-blue-600" : "bg-gray-200"}`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}>
                    {theme === "dark" ? (
                        <LucideMoon className="h-3 w-3 text-blue-600" />
                    ) : (
                        <LucideSun className="h-3 w-3 text-amber-500" />
                    )}
                </div>
            </div>
        </div>
    )
}