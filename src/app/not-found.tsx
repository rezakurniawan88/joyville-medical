import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
            <p className="text-gray-500 mb-8">
                Sorry, the page you are looking for doesn&apos;t exist.
            </p>
            <Link href="/">
                <Button>Back to Home</Button>
            </Link>
        </div>
    )
}