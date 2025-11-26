"use client"

import { Button } from "@/components/ui/button"
import { LucideShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

export default function Forbidden() {
    const router = useRouter()

    const handleGoBack = () => {
        router.back()
    }

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/auth/login" })
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="text-center px-6 py-8">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <LucideShieldAlert className="w-16 h-16 text-red-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-2">403 - Access Denied</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">You don&apos;t have permission to access this page. Please contact your administrator if you believe this is a mistake.</p>

                <div className="flex gap-4 justify-center">
                    <Button onClick={handleGoBack} variant="outline" className="cursor-pointer">Go Back</Button>
                    <Button onClick={handleSignOut} className="bg-blue-500 hover:bg-blue-600 cursor-pointer">Sign Out</Button>
                </div>
            </div>
        </div>
    )
}