import { LucideLoader2, LucideTrash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function MedicineDeleteModal({ medicineId, refetch }: { medicineId: number, refetch: () => void }) {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const { mutate: deleteMedicineHandler, isPending: loadingDeleteMedicine } = useMutation({
        mutationKey: ["deleteMedicine"],
        mutationFn: async (medicineId: number) => {
            const response = await axiosInstance.delete(`/medicines/${medicineId}`);
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            setModalIsOpen(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error("Something went wrong");
            console.log(error);
        }
    });

    return (
        <AlertDialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-red-500 p-2 cursor-pointer hover:bg-red-600"><LucideTrash className="w-5 h-5 dark:text-slate-100" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-3/4 sm:w-full dark:bg-slate-900">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete medicine data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer dark:bg-slate-800">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMedicineHandler(medicineId)} className="bg-red-500 hover:bg-red-600 cursor-pointer dark:text-slate-100">{loadingDeleteMedicine ? <LucideLoader2 className="animate-spin" /> : "Delete"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
