"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LucideEye, LucideLoader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export default function PaymentDetail({ appointment }: { appointment: any }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: processPayment, isPending } = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post(`/appointments/${appointment.id}/payment`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Payment processed successfully");
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
        },
        onError: () => {
            toast.error("Failed to process payment");
        }
    });

    const total = appointment.prescription.reduce(
        (sum: number, p: any) => sum + (p.medicine.price * p.quantity),
        0
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 p-2 cursor-pointer hover:bg-blue-600 dark:text-slate-100">
                    <LucideEye className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-4xl w-3/4 md:w-full p-4 md:p-6 dark:bg-slate-800">
                <DialogHeader className="w-3/4 pl-16 pb-3 sm:pl-0 sm:pb-0">
                    <DialogTitle className="text-base sm:text-lg">Payment Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Patient Name</p>
                            <p className="text-xs sm:text-sm font-medium">{appointment.patient.name}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                            <p className="text-xs sm:text-sm font-medium">{appointment.doctor.name}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Appointment Date</p>
                            <p className="text-xs sm:text-sm font-medium">
                                {new Date(appointment.appointmentDate).toLocaleString()}
                            </p>
                        </div>
                        {appointment.prescription.every((p: any) => p.status === "COMPLETED") ? (
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                <Badge className="bg-green-100 text-green-500 dark:bg-green-500 dark:text-slate-100">Completed</Badge>
                            </div>
                        ) : null}
                    </div>

                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="dark:bg-slate-700 rounded-xl">
                            <AccordionTrigger className="bg-gray-50 px-4 cursor-pointer dark:bg-slate-700">Diagnosis</AccordionTrigger>
                            <AccordionContent className="bg-gray-50 px-4 dark:bg-slate-700">
                                {appointment.diagnosis}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Prescribed Medicines</h3>
                        <div className="rounded-sm overflow-hidden border border-gray-100 dark:bg-slate-800 dark:border-gray-700">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-slate-700">
                                    <TableRow className="dark:hover:bg-slate-600">
                                        <TableHead className="px-4 text-xs sm:text-sm whitespace-nowrap dark:text-slate-300">Medicine</TableHead>
                                        <TableHead className="text-xs sm:text-sm dark:text-slate-300">Quantity</TableHead>
                                        <TableHead className="text-xs sm:text-sm dark:text-slate-300">Price</TableHead>
                                        <TableHead className="text-xs sm:text-sm dark:text-slate-300">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointment.prescription.map((prescription: any) => (
                                        <TableRow key={prescription.id} className="dark:hover:bg-slate-700">
                                            <TableCell className="px-4 text-xs sm:text-sm whitespace-nowrap dark:text-slate-200">{prescription.medicine.name}</TableCell>
                                            <TableCell className="text-xs sm:text-sm whitespace-nowrap dark:text-slate-200">{prescription.quantity} pcs</TableCell>
                                            <TableCell className="text-xs sm:text-sm whitespace-nowrap dark:text-slate-200">
                                                Rp.{prescription.medicine.price.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm whitespace-nowrap dark:text-slate-200">
                                                Rp.{(prescription.medicine.price * prescription.quantity).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                                        <TableCell colSpan={3} className="px-4 py-3 text-left font-bold text-xs sm:text-sm whitespace-nowrap dark:text-slate-200">
                                            Total
                                        </TableCell>
                                        <TableCell className="font-bold text-xs sm:text-sm whitespace-nowrap dark:text-slate-200">
                                            Rp.{total.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {appointment.prescription.every((p: any) => p.status === "PENDING") ? (
                        <div className="flex justify-end">
                            <Button
                                className="px-6 bg-green-600 hover:bg-green-700 cursor-pointer"
                                onClick={() => processPayment()}
                                disabled={isPending}
                            >
                                {isPending && <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Process Payment
                            </Button>
                        </div>
                    ) : null}

                </div>
            </DialogContent>
        </Dialog >
    );
}