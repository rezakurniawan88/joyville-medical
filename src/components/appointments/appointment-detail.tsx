import { LucideEye, LucideLoader2, LucideTrash } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

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

type PrescriptionItem = {
    medicineId: number;
    quantity: number;
    note?: string;
};

export default function AppointmentDetail({ appointment, refetch }: { appointment: AppointmentDetailProps, refetch: () => void }) {
    const [activeAction, setActiveAction] = useState<'COMPLETED' | 'CANCELLED' | null>(null);
    const [diagnosis, setDiagnosis] = useState<string>('');
    const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);

    const { data: dataMedicines } = useQuery({
        queryKey: ["get-medicines"],
        queryFn: async () => {
            const response = await axiosInstance.get("/medicines");
            return response?.data?.data;
        }
    })

    const { mutate: updateAppointmentHandler, isPending: updateAppointmentIsLoading } = useMutation({
        mutationKey: ["update-appointment-status"],
        mutationFn: async ({ appointmentId, status }: { appointmentId: number, status: string }) => {
            const response = await axiosInstance.patch(`/appointments/${appointmentId}/status`, {
                status,
                diagnosis,
                prescriptions
            });
            return response?.data?.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            refetch();
            setActiveAction(null);
        },
        onError: (error: any) => {
            toast.error("Error updating appointment status");
            console.log("error update appointment", error);
            setActiveAction(null);
        }
    });

    const handleAddPrescription = () => {
        setPrescriptions([...prescriptions, { medicineId: 0, quantity: 1, note: '' }]);
    };

    const handlePrescriptionChange = (index: number, field: keyof PrescriptionItem, value: any) => {
        const newPrescriptions = [...prescriptions];
        newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };
        setPrescriptions(newPrescriptions);
    };

    const handleStatusUpdate = (status: 'COMPLETED' | 'CANCELLED') => {
        setActiveAction(status);
        updateAppointmentHandler({ appointmentId: appointment.id, status });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 p-2 cursor-pointer hover:bg-blue-600">
                    <LucideEye className="w-5 h-5 dark:text-slate-100" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl sm:max-h-screen w-3/4 sm:w-full dark:bg-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Appointment Details</DialogTitle>
                </DialogHeader>

                <ScrollArea>
                    <div className="space-y-4">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1" className="dark:bg-slate-700 rounded-xl">
                                <AccordionTrigger className="bg-gray-50 px-4 cursor-pointer dark:bg-slate-700">Patient Details</AccordionTrigger>
                                <AccordionContent className="bg-gray-50 px-4 dark:bg-slate-700">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Patient Name</p>
                                            <p className="text-xs sm:text-sm font-medium dark:text-slate-200">{appointment.patient.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ID Card</p>
                                            <p className="text-xs sm:text-sm font-medium dark:text-slate-200">{appointment.patient.idCard}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                                            <p className="text-xs sm:text-sm font-medium dark:text-slate-200">
                                                {new Date(appointment.patient.dateOfBirth).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Gender</p>
                                            <p className="text-xs sm:text-sm font-medium dark:text-slate-200">{appointment.patient.gender}</p>
                                        </div>
                                        {appointment.patient.phone && (
                                            <div>
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                <p className="text-xs sm:text-sm font-medium dark:text-slate-200">{appointment.patient.phone}</p>
                                            </div>
                                        )}
                                        {appointment.patient.email && (
                                            <div>
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="text-xs sm:text-sm font-medium dark:text-slate-200">{appointment.patient.email}</p>
                                            </div>
                                        )}
                                        {appointment.patient.address && (
                                            <div className="col-span-2">
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                <p className="text-xs sm:text-sm font-medium dark:text-slate-200">{appointment.patient.address}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Appointment Date</p>
                                            <p className="text-xs sm:text-sm font-medium dark:text-slate-200">
                                                {new Date(appointment.appointmentDate).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Reason</p>
                                            <p className="text-xs sm:text-sm font-medium dark:text-slate-200">{appointment.reason}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Current Status</p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${appointment.status === "COMPLETED"
                                                ? "bg-green-100 text-green-800 dark:bg-green-500 dark:text-slate-100"
                                                : appointment.status === "CANCELLED"
                                                    ? "bg-red-100 text-red-800 dark:bg-red-500 dark:text-slate-100"
                                                    : "bg-blue-100 text-blue-800 dark:bg-blue-500 dark:text-slate-100"
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {appointment.status === "SCHEDULED" && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Diagnosis</h3>
                                    <Textarea
                                        placeholder="Enter diagnosis..."
                                        className="dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400"
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold">Prescriptions</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="dark:bg-slate-700"
                                            onClick={handleAddPrescription}
                                        >
                                            Add Medicine
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {prescriptions.map((prescription, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <Select
                                                    value={prescription.medicineId.toString()}
                                                    onValueChange={(value) =>
                                                        handlePrescriptionChange(index, 'medicineId', parseInt(value))
                                                    }
                                                >
                                                    <SelectTrigger className="w-[200px] dark:bg-slate-800 dark:placeholder:text-slate-300 dark:text-slate-300">
                                                        <SelectValue placeholder="Select medicine" />
                                                    </SelectTrigger>
                                                    <SelectContent className="dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-300">
                                                        {dataMedicines?.map((medicine: any) => (
                                                            <SelectItem
                                                                key={medicine.id}
                                                                className="dark:hover:bg-slate-700"
                                                                value={medicine.id.toString()}
                                                            >
                                                                {medicine.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    className="w-[100px] dark:bg-slate-800 dark:placeholder:text-slate-300 dark:text-slate-300"
                                                    value={prescription.quantity}
                                                    onChange={(e) =>
                                                        handlePrescriptionChange(
                                                            index,
                                                            'quantity',
                                                            parseInt(e.target.value) || 1
                                                        )
                                                    }
                                                    min={1}
                                                />

                                                <Input
                                                    placeholder="Notes"
                                                    className="dark:bg-slate-800 dark:placeholder:text-slate-300 dark:text-slate-300"
                                                    value={prescription.note || ''}
                                                    onChange={(e) =>
                                                        handlePrescriptionChange(index, 'note', e.target.value)
                                                    }
                                                />

                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="dark:bg-red-600"
                                                    onClick={() => {
                                                        const newPrescriptions = [...prescriptions];
                                                        newPrescriptions.splice(index, 1);
                                                        setPrescriptions(newPrescriptions);
                                                    }}
                                                >
                                                    <LucideTrash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end">
                                    <Button
                                        onClick={() => handleStatusUpdate("CANCELLED")}
                                        className="bg-red-600 hover:bg-red-700 cursor-pointer dark:text-slate-100"
                                        disabled={updateAppointmentIsLoading && activeAction === "CANCELLED"}
                                    >
                                        {updateAppointmentIsLoading && activeAction === "CANCELLED" ? (
                                            <LucideLoader2 className="animate-spin mr-2" />
                                        ) : null}
                                        Cancel Appointment
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate("COMPLETED")}
                                        className="bg-green-600 hover:bg-green-700 cursor-pointer dark:text-slate-100"
                                        disabled={updateAppointmentIsLoading && activeAction === "COMPLETED"}
                                    >{updateAppointmentIsLoading && activeAction === "COMPLETED" ? (
                                        <LucideLoader2 className="animate-spin mr-2" />
                                    ) : null}
                                        Complete & Send to Pharmacy
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
