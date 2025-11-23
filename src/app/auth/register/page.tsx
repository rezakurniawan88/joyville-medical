"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { LucideEye, LucideEyeOff, LucideLoader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import AuthBackground from "@/../public/images/auth-bg.jpg"
import Image from "next/image";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const formSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long"),
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    const { mutate: handleRegister, isPending: registerIsLoading } = useMutation({
        mutationKey: ['register'],
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const response = await axiosInstance.post("/register", {
                username: values.username,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            return response?.data?.message;
        },
        onSuccess: (message) => {
            toast(message || "Register successful!");
            router.push("/auth/login");
        },
        onError: (error) => {
            toast(error?.message || "Register failed. Please try again.");
            console.log("Register error:", error);
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        handleRegister(values);
    }

    return (
        <main className="flex min-h-screen">
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

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-4 py-6 dark:bg-slate-900">
                <div className="w-full max-w-md space-y-8 p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1 dark:text-slate-100">Create an account</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Please enter your details to create an account.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-slate-400">Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your username"
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
                                                    className="py-6 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300 dark:border-slate-500 pr-10"
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-slate-400">Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="py-6 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors pr-10 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300 dark:border-slate-500"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    {showConfirmPassword ? (
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

                            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium">{registerIsLoading ? <LucideLoader2 className="animate-spin" /> : "Create account"}</Button>

                            <p className="text-center text-gray-600 dark:text-slate-400">Already have an account? <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Sign in</Link>
                            </p>
                        </form>
                    </Form>
                </div>
            </div>
        </main>
    )
}
