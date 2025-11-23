"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import axiosInstance from "@/lib/axios"

export function CreateAppointmentForm({ patientId, setModalOpen, refetch }: { patientId: number, setModalOpen: (open: boolean) => void, refetch: () => void }) {
    const formSchema = z.object({
        doctorId: z.string().min(1, "Doctor is required"),
        appointmentDate: z.string().min(1, "Appointment date is required"),
        reason: z.string().min(1, "Reason is required"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            doctorId: "",
            appointmentDate: "",
            reason: "",
        },
    })

    const { data: doctors } = useQuery({
        queryKey: ["doctors"],
        queryFn: async () => {
            const response = await axiosInstance.get("/employees/doctors");
            return response?.data?.data;
        },
    })

    const { mutate: createAppointment, isPending: createAppointmentIsLoading } = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const response = await axiosInstance.post("/appointments", {
                ...values,
                patientId,
                doctorId: parseInt(values.doctorId),
            })
            return response.data?.message;
        },
        onSuccess: (data) => {
            toast.success(data)
            form.reset();
            setModalOpen(false);
            refetch();
        },
        onError: (error) => {
            toast.error("Failed to create appointment")
            console.error(error)
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createAppointment(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Doctor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400">
                                        <SelectValue placeholder="Select a doctor" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="dark:bg-slate-800 dark:placeholder:text-slate-300 dark:text-slate-300">
                                    {doctors?.map((doctor: any) => (
                                        <SelectItem key={doctor.id} value={doctor.id.toString()} className="text-xs sm:text-sm dark:hover:bg-slate-700">
                                            {doctor.name}
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
                    name="appointmentDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Appointment Date</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs sm:text-sm text-gray-800 dark:text-gray-400">Reason</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="text-xs sm:text-sm dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={createAppointmentIsLoading} className="w-full text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 cursor-pointer dark:text-slate-100">
                    {createAppointmentIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Appointment
                </Button>
            </form>
        </Form>
    )
}