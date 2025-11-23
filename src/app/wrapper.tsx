"use client"

import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { usePathname } from "next/navigation"
import { isValidElement } from "react";
import NotFound from "./not-found";
import Forbidden from "./forbidden";

export default function Wrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const excludedPaths = [
        '/auth/login',
        '/auth/register',
    ];

    const shouldExcludeHeaderAndSidebar = excludedPaths.includes(pathname)

    if (shouldExcludeHeaderAndSidebar) {
        return <>{children}</>
    }

    if (
        isValidElement(children) &&
        (children.type === NotFound || children.type === Forbidden)
    ) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex min-h-screen">
                <Sidebar />
                {children}
            </div>
        </div>
    )
}