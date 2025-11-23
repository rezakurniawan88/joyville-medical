"use client"

import AppointmentDeleteModal from "@/components/appointments/appointment-delete-modal";
import AppointmentDetail from "@/components/appointments/appointment-detail";
import PaginationTabel from "@/components/pagination-tabel";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import axiosInstance from "@/lib/axios";
import { useSidebar } from "@/stores/stores";
import { useQuery } from "@tanstack/react-query";
import { LucideLoader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { forbidden } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
    patientId: string,
    doctorId: string,
    appointmentDate: string;
    reason?: string;
    status: AppointmentStatus;
    doctor: {
        name: string
    }
};

export default function AppointmentsPage() {
    const { isSidebarOpen } = useSidebar((state) => state);
    const { data: session } = useSession();
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const itemsPerPage = 10;

    if (!["DOCTOR", "SUPER_ADMIN"].includes(session?.user?.role as string)) {
        forbidden()
    }

    const { data: dataDoctorsAppointments, isLoading: loadingDoctorAppointments, refetch: refetchDoctorsAppointment } = useQuery({
        queryKey: ["doctors-appointments"],
        queryFn: async () => {
            const doctorId = session?.user?.id;

            const response = await axiosInstance.get(`/employees/doctors/${doctorId}/appointments`);
            return response?.data?.data;
        },
        enabled: !!session?.user?.id,
    })

    const filteredData = useMemo(() => {
        if (!dataDoctorsAppointments) return [];
        if (!debouncedSearch) return dataDoctorsAppointments;

        return dataDoctorsAppointments.filter((appointment: any) =>
            appointment?.patient?.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [dataDoctorsAppointments, debouncedSearch]);

    const totalItems = filteredData?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentData = filteredData.slice(startIndex, endIndex);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch])

    return (
        <div className={`flex-1 pt-16 p-6 transition-all duration-300 dark:bg-[#111b35] ${isSidebarOpen ? "ml-50 sm:ml-64" : "ml-16"}`}>
            <Breadcrumb className="mt-7 mb-5">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="font-semibold dark:text-slate-400">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold dark:text-slate-100">Appointment</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-slate-100">Appointments</h1>

            <div className="mt-4 sm:mt-7 px-3 sm:px-6 pt-2 pb-7 bg-white rounded-xl dark:bg-slate-900 dark:border-slate-700">
                <div className="flex flex-col md:flex-row  md:items-center justify-between pt-2 pb-4">
                    <h1 className="text-base md:text-lg font-bold dark:text-slate-100 mb-3 sm:mb-0">Appointments List</h1>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <form className="w-full sm:w-auto">
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                                    <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" placeholder="Search by name..." required value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </form>
                    </div>
                </div>
                {loadingDoctorAppointments ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <LucideLoader2 className="w-10 h-10 animate-spin text-gray-400" />
                        <p className="mt-4 text-gray-500 text-sm">Loading appointments data...</p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-lg overflow-hidden border border-gray-100 dark:bg-slate-900 dark:border-slate-700">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-slate-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-gray-500 dark:text-slate-300">ID</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300">Patient Name</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300">Appointment Date</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 hidden md:table-cell">Reason</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 hidden md:table-cell">Doctor</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300">Status</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!currentData || currentData?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">No Doctors Data</TableCell>
                                        </TableRow>
                                    ) : currentData?.map((appointment: AppointmentDetailProps, index: number) => (
                                        <TableRow key={index} className="dark:hover:bg-slate-800">
                                            <TableCell className="font-medium px-4 dark:text-slate-300">{index + 1}</TableCell>
                                            <TableCell className="font-semibold px-4 dark:text-slate-300">{appointment?.patient?.name}</TableCell>
                                            <TableCell className="dark:text-slate-300">{new Date(appointment?.appointmentDate).toLocaleDateString()}</TableCell>
                                            <TableCell className="dark:text-slate-300 hidden md:table-cell">{appointment?.reason}</TableCell>
                                            <TableCell className="dark:text-slate-300 hidden md:table-cell">{appointment?.doctor?.name}</TableCell>
                                            <TableCell className="dark:text-slate-300">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${appointment.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-500 dark:text-slate-100"
                                                    : appointment.status === "CANCELLED"
                                                        ? "bg-red-100 text-red-800 dark:bg-red-500 dark:text-slate-100"
                                                        : "bg-blue-100 text-blue-800 dark:bg-blue-500 dark:text-slate-100"
                                                    }`}>
                                                    {appointment.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <AppointmentDetail appointment={appointment} refetch={refetchDoctorsAppointment} />
                                                <AppointmentDeleteModal appointment={appointment} refetch={refetchDoctorsAppointment} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <PaginationTabel
                            page={page}
                            totalItems={totalItems}
                            totalPages={totalPages}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            setPage={setPage}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
