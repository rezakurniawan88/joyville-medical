"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { PatientType } from "@/types/patient-types";
import { CreateAppointmentForm } from "./patient-appointment-create";
import { useState } from "react";

type AppointmentType = {
    id: number;
    appointmentDate: string;
    doctor: {
        id?: number;
        name: string;
    };
    reason?: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | string;
};

export default function PatientAppointment({ patient, refetch }: { patient: PatientType, refetch: () => void }) {
    const [modalOpen, setModalOpen] = useState(false);

    const appointments = (patient.appointments ?? []) as unknown as AppointmentType[];

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <h3 className="text-base md:text-lg font-semibold">Appointments</h3>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 text-xs md:text-sm hover:bg-blue-700 cursor-pointer dark:text-slate-100">+ Create</Button>
                    </DialogTrigger>
                    <DialogContent className="md:max-w-4xl w-3/4 md:w-full p-4 md:p-6 dark:bg-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-base sm:text-lg">Create Appointment</DialogTitle>
                        </DialogHeader>
                        <CreateAppointmentForm patientId={patient.id} setModalOpen={setModalOpen} refetch={refetch} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-auto">
                <ScrollArea className="max-h-[300px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="dark:hover:bg-slate-700">
                                <TableHead className="whitespace-nowrap">Date</TableHead>
                                <TableHead className="whitespace-nowrap">Doctor</TableHead>
                                <TableHead className="hidden md:table-cell whitespace-nowrap">Reason</TableHead>
                                <TableHead className="whitespace-nowrap">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No appointments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                appointments.map((appointment: AppointmentType) => (
                                    <TableRow key={appointment.id} className="dark:hover:bg-slate-700">
                                        <TableCell className="whitespace-nowrap text-xs md:text-sm">
                                            {new Date(appointment.appointmentDate).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-xs md:text-sm">{appointment.doctor.name}</TableCell>
                                        <TableCell className="hidden md:table-cell max-w-[200px] truncate text-xs md:text-sm">{appointment.reason}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${appointment.status === 'COMPLETED'
                                                ? 'bg-green-100 text-green-800'
                                                : appointment.status === 'CANCELLED'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    )
}