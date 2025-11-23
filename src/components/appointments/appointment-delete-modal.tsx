import { LucideLoader2, LucideTrash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

type AppointmentDetailProps = {
    id: number;
    patient: {
        name: string;
        idCard: string;
        dateOfBirth: string;
        gender: string;
        phone?: string;
        email?: string;
        address?: string;
    };
    appointmentDate: string;
    reason?: string;
    status: AppointmentStatus;
};

export default function AppointmentDeleteModal({ appointment, refetch }: { appointment: AppointmentDetailProps, refetch: () => void }) {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const { mutate: deleteAppointmentHandler, isPending: deleteAppointmentIsLoading } = useMutation({
        mutationKey: ["delete-appointment"],
        mutationFn: async (appoinmentId: number) => {
            const response = await axiosInstance.delete(`/appointments/${appoinmentId}`);
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            setModalIsOpen(false);
            refetch();
        },
        onError: (error) => {
            toast.error("Delete Appointment Failed")
            console.log(error);
        }
    })

    return (
        <AlertDialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-red-500 p-2 cursor-pointer hover:bg-red-600"><LucideTrash className="w-5 h-5 dark:text-slate-100" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-3/4 sm:w-full dark:bg-slate-900">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete patient data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer dark:bg-slate-800">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAppointmentHandler(appointment.id)} className="bg-red-500 hover:bg-red-600 cursor-pointer dark:text-slate-100">
                        {deleteAppointmentIsLoading ? (<LucideLoader2 className="animate-spin mr-2" />) : null}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
