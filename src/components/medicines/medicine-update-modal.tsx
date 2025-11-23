import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePencil } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

type MedicineProps = {
    id: number
    name: string
    description: string
    price: number
    stock: number
    createdAt: Date
    updatedAt: Date
}

export default function MedicineUpdateModal({ medicine, refetch }: { medicine: MedicineProps, refetch: () => void }) {
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
            name: medicine.name || "",
            description: medicine.description || "",
            price: medicine.price.toString() || "",
            stock: medicine.stock.toString() || "",
        },
    });

    const { mutate: updateMedicineHandler, isPending: updateMedicineIsLoading } = useMutation({
        mutationKey: ["update-medicine"],
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const medicineId = medicine.id;
            const response = await axiosInstance.patch(`/medicines/${medicineId}`, values);
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast(data);
            setModalOpen(false);
            refetch();
        },
        onError: (error) => {
            toast("Something went wrong!!");
            console.error(error);
        }
    })

    useEffect(() => {
        if (modalOpen) {
            form.setValue('name', medicine.name);
            form.setValue('description', medicine.description);
            form.setValue('price', medicine.price.toString());
            form.setValue('stock', medicine.stock.toString());
        }
    }, [modalOpen, medicine, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        updateMedicineHandler(values);
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 p-2 cursor-pointer hover:bg-blue-600">
                    <LucidePencil className="w-5 h-5 dark:text-slate-100" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-3/4 sm:w-full dark:bg-slate-900">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-base sm:text-lg dark:text-slate-100">Update Medicine</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-gray-400">Update your medicines with the following details.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Medicine Name</FormLabel>
                                    <Input placeholder="Medicine name ..." autoFocus {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300" />
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
                                    <Input placeholder="Description" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300" />
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
                                    <Input placeholder="Price" type="number" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300" />
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
                                    <Input placeholder="Stock" type="number" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 cursor-pointer dark:text-slate-100">{updateMedicineIsLoading ? <LucideLoader2 className="animate-spin" /> : "Update Medicine"}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
