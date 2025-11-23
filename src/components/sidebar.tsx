import { menuItems } from "@/config/menu-items";
import { Role } from "@/generated/prisma";
import { useSidebar } from "@/stores/stores";
import { LucideChevronLeft, LucideHospital } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export default function Sidebar() {
    const { isSidebarOpen, toggleSidebar } = useSidebar((state) => state);
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role as Role;

    const userMenuItems = userRole ? (menuItems[userRole] ?? []) : [];

    const isPathActive = (itemPath: string) => {
        if (itemPath === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(itemPath)
    }

    return (
        <div className={`fixed top-0 h-screen bg-white transition-all duration-300 ease-in-out z-40 dark:bg-slate-900 ${isSidebarOpen ? "w-50 sm:w-64" : "w-16"}`}>
            <div className="py-[1.30rem] pl-6 pr-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LucideHospital className={isSidebarOpen ? "w-5 h-5 text-blue-500" : "hidden"} size="icon" />
                        <h1 className={`text-sm sm:text-xl font-bold text-blue-500 transition-opacity duration-300 ${isSidebarOpen ? "block" : "hidden"}`}>Joyville</h1>
                    </div>
                    <button onClick={() => toggleSidebar()} className={`p-1.5 rounded-full cursor-pointer transition-transform duration-300 hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-400 ${!isSidebarOpen ? "rotate-180 -ml-2" : ""}`}><LucideChevronLeft className="w-5 h-5" /></button>
                </div>
            </div>
            <hr className="text-slate-300" />
            <div className="space-y-3 px-4 pt-5">
                <h1 className={`text-xs text-gray-500 font-semibold pl-2 transition-opacity duration-300 dark:text-gray-100 ${isSidebarOpen ? "block" : "hidden"}`}>Main menu</h1>
                <div className="space-y-2">
                    {userMenuItems.map((item: any) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex justify-between items-center rounded-lg cursor-pointer py-2 px-2 hover:bg-gray-50 dark:hover:bg-slate-800 ${isPathActive(item.path) ? "bg-gray-50 dark:bg-slate-800" : ""}`}
                        >
                            <div className="flex items-center gap-1.5">
                                {isPathActive(item.path) && (
                                    <div className={`bg-blue-500 w-1 h-6 rounded-xl ${!isSidebarOpen ? "hidden" : ""
                                        }`} />
                                )}
                                <item.icon className={`w-4 h-4 min-w-[1.25rem] ${isPathActive(item.path) ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                                    }`} />
                                <h2 className={`text-xs sm:text-sm font-semibold transition-opacity duration-300 ${isPathActive(item.path) ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                                    } ${isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                                    {item.label}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-8 left-8 space-y-4">
                {isSidebarOpen && <ThemeToggle />}
            </div>
        </div>
    )
}
