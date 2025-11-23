import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePencil } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type EmployeeProps = {
    id: string;
    name: string;
    email: string;
    role: string;
}

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().optional(),
    role: z.string(),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.password) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function EmployeeEditModal({ employee, refetch }: { employee: EmployeeProps, refetch: () => void }) {
    const [modalOpen, setModalOpen] = useState(false);
    const roleList = ["USER", "ADMIN", "DOCTOR", "APPOTHECARY", "CASHIER"];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: employee.name,
            email: employee.email,
            role: employee.role,
            password: "",
            confirmPassword: ""
        },
    });

    const { mutate: updateEmployeeHandler, isPending: updateEmployeeIsLoading } = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const updateData = {
                name: values.username,
                email: values.email,
                role: values.role,
                ...(values.password ? { password: values.password } : {})
            };

            const response = await axiosInstance.patch(`/employees/${employee.id}`, updateData);
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            setModalOpen(false);
            refetch();
        },
        onError: (error) => {
            toast.error("Failed to update employee");
            console.error(error);
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        updateEmployeeHandler(values);
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 p-2 cursor-pointer hover:bg-blue-600">
                    <LucidePencil className="w-5 h-5 dark:text-slate-100" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-3/4 sm:w-full dark:bg-slate-900">
                <DialogHeader>
                    <DialogTitle className="dark:text-slate-100">Edit Employee</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
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
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
                                    </FormControl>
                                    <FormMessage />
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
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400">
                                            {roleList.map((role) => (
                                                <SelectItem key={role} value={role} className="text-xs sm:text-sm dark:hover:bg-slate-700 ">
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">New Password (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer dark:text-slate-100" disabled={updateEmployeeIsLoading}>
                            {updateEmployeeIsLoading && (
                                <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update Employee
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}