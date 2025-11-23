import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function EmployeeCreateModal({ refetch }: { refetch: () => void }) {
    const [modalOpen, setModalOpen] = useState(false);

    const roleList = ["USER", "ADMIN", "DOCTOR", "APPOTHECARY", "CASHIER"]

    const formSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long"),
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        role: z.string(),
        confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            role: "USER",
            confirmPassword: ""
        },
    });

    const { mutate: createEmployeeHandler, isPending: createEmployeeIsLoading } = useMutation({
        mutationKey: ["create-new-employee"],
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const response = await axiosInstance.post("/register", values);
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            setModalOpen(false);
            refetch();
        },
        onError: (error) => {
            toast.error("Something went wrong");
            console.log(error);
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createEmployeeHandler(values);
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-xs text-white font-bold flex gap-2 hover:bg-blue-600 cursor-pointer">
                    <LucidePlusCircle />
                    <h1>Add New</h1>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-3/4 sm:w-full dark:bg-slate-900">
                <DialogHeader className="mb-2">
                    <DialogTitle className="dark:text-slate-100">Add New Employee</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-gray-400">Create your new employee with the following details.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Username</FormLabel>
                                    <Input placeholder="Your username ..." {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Email</FormLabel>
                                    <Input placeholder="your@email.com" type="email" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Password</FormLabel>
                                    <Input placeholder="••••••••" type="password" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400">
                                                <SelectValue placeholder="Select a doctor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400">
                                            {roleList?.map((role: any, index: number) => (
                                                <SelectItem key={index} value={role} className="text-xs sm:text-sm dark:hover:bg-slate-700 ">
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer dark:text-slate-100">{createEmployeeIsLoading ? <LucideLoader2 className="animate-spin mr-2" /> : null}Create Employee</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
