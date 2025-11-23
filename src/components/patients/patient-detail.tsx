import { LucideEye } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { PatientType } from "@/types/patient-types";
import PatientViewDetail from "./patient-view-detail";
import PatientAppointment from "./patient-appointment";

export default function PatientDetail({ patient, refetch }: { patient: PatientType, refetch: () => void }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 p-2 cursor-pointer hover:bg-blue-600">
                    <LucideEye className="w-5 h-5 dark:text-slate-100" />
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-4xl w-3/4 md:w-full p-4 md:p-6 dark:bg-slate-800">
                <DialogHeader className="w-3/4 pl-9 pb-2 sm:pl-0 sm:pb-0">
                    <DialogTitle className="text-base sm:text-lg">Patient Details</DialogTitle>
                </DialogHeader>
                <PatientViewDetail patient={patient} />
                <PatientAppointment patient={patient} refetch={refetch} />
            </DialogContent>
        </Dialog>
    )
}
