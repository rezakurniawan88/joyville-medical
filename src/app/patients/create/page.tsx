"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import { useSidebar } from "@/stores/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LucideLoader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod"

export default function CreatePatientPage() {
    const { isSidebarOpen } = useSidebar((state) => state);
    const router = useRouter();

    const formSchema = z.object({
        idCard: z.string().min(5).max(20),
        name: z.string().min(2).max(50),
        dateOfBirth: z.string(),
        gender: z.string(),
        address: z.string(),
        phone: z.string()
            .min(10, "Phone number must be at least 10 digits")
            .max(15, "Phone number must not exceed 15 digits")
            .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
        email: z.email(),
        bloodType: z.string().min(1).max(2),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idCard: "",
            name: "",
            dateOfBirth: "",
            gender: "",
            address: "",
            phone: "",
            email: "",
            bloodType: "",
        },
    })

    const { mutate: createPatientHandler, isPending: loadingCreatePatient } = useMutation({
        mutationKey: ["createPatient"],
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const response = await axiosInstance.post("/patients", data);
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            form.reset();
            router.push("/patients");
        },
        onError: (error: any) => {
            toast.error("Something went wrong");
            console.log(error);
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createPatientHandler(values);
    }

    return (
        <div className={`flex-1 pt-16 p-6 transition-all duration-300 dark:bg-[#111b35] ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
            <Breadcrumb className="mt-9 sm:mt-7 mb-4 sm:mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="font-semibold dark:text-slate-400">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/patients" className="font-semibold dark:text-slate-400">Patients</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold dark:text-slate-100">Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Create Patient</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-5">
                    <FormField
                        control={form.control}
                        name="idCard"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm dark:text-gray-300">ID Card</FormLabel>
                                <FormControl>
                                    <Input placeholder="ID Card Number" {...field} className="text-xs sm:text-sm dark:placeholder:text-slate-400 dark:text-slate-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm dark:text-gray-300">Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name ..." {...field} className="text-xs sm:text-sm dark:placeholder:text-slate-400 dark:text-slate-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm dark:text-gray-300">Date Of Birth</FormLabel>
                                <FormControl>
                                    <Input placeholder="Date of birth" type="date" {...field} className="text-xs sm:text-sm dark:placeholder:text-slate-400 dark:text-slate-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-xs sm:text-sm dark:text-gray-300">Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full text-xs sm:text-sm dark:placeholder:text-slate-400 dark:text-slate-400">
                                            <SelectValue placeholder="Select your gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400">
                                        <SelectItem value="Male" className="text-xs sm:text-sm dark:hover:bg-slate-700">Male</SelectItem>
                                        <SelectItem value="Female" className="text-xs sm:text-sm dark:hover:bg-slate-700">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm dark:text-gray-300">Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Street Name" {...field} className="text-xs sm:text-sm dark:placeholder:text-slate-400 dark:text-slate-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm dark:text-gray-300">Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+123 456 789" type="tel" {...field} className="text-xs sm:text-sm dark:placeholder:text-slate-400 dark:text-slate-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm dark:text-gray-300">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="youremail@email.com" type="email" {...field} className="text-xs sm:text-sm dark:placeholder:text-slate-400 dark:text-slate-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm dark:text-gray-300">Blood Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="AA" type="text" {...field} className="text-xs sm:text-sm dark:placeholder:text-slate-400 dark:text-slate-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full py-5 sm:py-6 bg-blue-600 hover:bg-blue-700 cursor-pointer dark:text-slate-100">{loadingCreatePatient ? <LucideLoader2 className="animate-spin mr-2" /> : null}Create Patient</Button>
                </form>
            </Form>
        </div>
    )
}
