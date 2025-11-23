import { LucideLoader2, LucideTrash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";

export default function EmployeeDeleteModal({ employeeId, refetch }: { employeeId: number, refetch: () => void }) {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const { mutate: deleteEmployeeHandler, isPending: deleteEmployeeIsLoading } = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.delete(`/employees/${employeeId}`);
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            setModalIsOpen(false);
            refetch();
        },
        onError: (error) => {
            toast.error("Failed to delete employee");
            console.error(error);
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
                    <AlertDialogAction onClick={() => deleteEmployeeHandler()} className={`${deleteEmployeeIsLoading ? "bg-red-200" : "bg-red-500"} hover:bg-red-600 cursor-pointer dark:text-slate-100`}>{deleteEmployeeIsLoading ? <LucideLoader2 className="animate-spin" /> : "Delete"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
