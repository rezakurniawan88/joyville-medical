"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LucideEye, LucideEyeOff, LucideLoader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import AuthBackground from "@/../public/images/auth-bg.jpg"
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const formSchema = z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(1, "Password must be at least 6 characters long"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const { mutate: handleLogin, isPending: loginIsLoading } = useMutation({
        mutationKey: ['login'],
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            return await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
                callbackUrl: "/"
            });
        },
        onSuccess: (response) => {
            if (response?.ok) {
                toast("Login successful!");
                router.push("/");
            } else {
                toast("Login failed. Please check your credentials.");
            }
        },
        onError: (error) => {
            toast(error?.message || "Login failed. Please try again.");
            console.log("Login error:", error);
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        handleLogin(values);
    }

    return (
        <main className="flex h-screen">
            <div className="relative hidden lg:flex w-1/2">
                <Image
                    src={AuthBackground}
                    alt="Medical center background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex items-center justify-center w-full">
                    <div className="px-8">
                        <h2 className="text-4xl font-bold text-white mb-4">Welcome to Joyville</h2>
                        <p className="text-gray-100 leading-relaxed">Streamlining healthcare management with modern solutions.</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-4 dark:bg-slate-900">
                <div className="w-full max-w-md space-y-8 p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1 dark:text-slate-100">Welcome back to Joyville</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Login to continue</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-slate-400">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="example@email.com"
                                                className="py-6 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300 dark:border-slate-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-slate-400">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="py-6 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors pr-10 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300 dark:border-slate-500"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <LucideEyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <LucideEye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="remember_me"
                                        id="remember_me"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="remember_me" className="text-sm text-gray-600 dark:text-slate-400">Remember me</label>
                                </div>
                                <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</Link>
                            </div>

                            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium">{loginIsLoading ? <LucideLoader2 className="animate-spin" /> : "Log in"}</Button>

                            <p className="text-center text-gray-600 dark:text-slate-400">Don&apos;t have an account? <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Create account</Link>
                            </p>
                        </form>
                    </Form>
                </div>
            </div>
        </main>
    )
}
