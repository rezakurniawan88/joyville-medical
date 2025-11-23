import { useProfile, useSidebar } from "@/stores/stores";
import { LucideChevronDown, LucideLogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export default function Header() {
    const { isSidebarOpen } = useSidebar((state) => state);
    const { isProfileOpen, toggleProfile } = useProfile((state) => state);
    const { data: session } = useSession();

    return (
        <header className={`fixed top-0 left-0 right-0 h-[4.7rem] pb-1 bg-white border-b-[1px] border-gray-100 z-10 transition-all duration-300 dark:bg-slate-900 dark:border-slate-700 ${isSidebarOpen ? "ml-50 sm:ml-64" : "ml-16"}`}>
            <div className="flex justify-between items-center px-4 w-full h-full">
                <form className="w-2/6">
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
                            <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" className="block w-full p-2.5 sm:p-3 ps-11 text-sm text-gray-900 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" placeholder="Search ..." required />
                    </div>
                </form>

                {session ? (
                    <Popover open={isProfileOpen} onOpenChange={toggleProfile}>
                        <PopoverTrigger asChild>
                            <div className="flex items-center gap-3 sm:gap-4 py-3 px-0 sm:px-2 m-1 hover:bg-slate-100/40 rounded-lg cursor-pointer dark:hover:bg-slate-800">
                                <div className="relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden bg-gray-50 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-11 h-11 sm:w-12 sm:h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                </div>
                                <div>
                                    <h1 className="text-xs sm:text-sm font-bold">{session ? session?.user?.name : "John Doe"}</h1>
                                    <h1 className="text-[0.65rem] sm:text-xs text-gray-500 dark:text-gray-400">{session ? session?.user?.role : "Administrator"}</h1>
                                </div>
                                <button className="p-1.5 cursor-pointer">
                                    <LucideChevronDown className="w-5 h-5" />
                                </button>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent asChild className="w-40 sm:w-52 p-2" align="end">
                            <div className={`z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:divide-gray-600 transition-all duration-300 dark:bg-[#111b35] ${isProfileOpen ? "block" : "hidden"}`}>
                                <div className="px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white">
                                    <div className="dark:text-slate-400">{session ? session?.user?.name : "John Doe"}</div>
                                    <div className="font-medium truncate dark:text-slate-300">{session ? session?.user?.email : "john@email.com"}</div>
                                </div>
                                <ul className="py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <a href="#" className="block px-4 py-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-slate-400">Dashboard</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-slate-400">Settings</a>
                                    </li>
                                </ul>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className="flex gap-2 items-center mt-1 px-4 rounded-sm text-red-500 hover:bg-gray-100 cursor-pointer dark:hover:bg-slate-700">
                                            <LucideLogOut className="w-4 h-4" size="icon" />
                                            <h1 className="block py-2 text-xs sm:text-sm">Sign out</h1>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="w-3/4 sm:w-1/2 dark:bg-slate-900">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure to logout?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to logout from your account? You will need to enter your credentials again to log back in.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="cursor-pointer dark:bg-slate-800">Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => signOut({
                                                callbackUrl: "/auth/login"
                                            })} className="bg-red-500 hover:bg-red-600 cursor-pointer dark:text-slate-100">Logout</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Button onClick={() => signIn()} className="bg-blue-600 text-white px-7 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-300 cursor-pointer">Login</Button>
                )}
            </div>
        </header>
    )
}