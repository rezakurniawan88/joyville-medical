import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

export default function MedicineCreateModal({ refetch }: { refetch: () => void }) {
    const [modalOpen, setModalOpen] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Name is required"),
        price: z.string(),
        stock: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            stock: "",
        },
    });

    const { mutate: addNewMedicineHandler, isPending: addNewMedicineIsLoading } = useMutation({
        mutationKey: ["add-new-medicine"],
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const response = await axiosInstance.post("/medicines", values);
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast(data);
            setModalOpen(false);
            refetch();
        },
        onError: (error) => {
            toast("Something went wrong");
            console.log(error);
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        addNewMedicineHandler(values);
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-xs text-white font-bold flex gap-2 hover:bg-blue-600 cursor-pointer">
                    <LucidePlusCircle />
                    <h1>Add Medicine</h1>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-3/4 sm:w-full dark:bg-slate-900">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-base sm:text-lg dark:text-slate-100">Add New Medicine</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-gray-400">Create your new medicines with the following details.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Medicine Name</FormLabel>
                                    <Input placeholder="Medicine name ..." {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Description</FormLabel>
                                    <Input placeholder="Medicine description" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Price (Rp.)</FormLabel>
                                    <Input placeholder="Rp.50,000" type="number" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Stock</FormLabel>
                                    <Input placeholder="0" type="number" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 cursor-pointer dark:text-slate-100">{addNewMedicineIsLoading ? <LucideLoader2 className="animate-spin" /> : "Add Medicine"}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
