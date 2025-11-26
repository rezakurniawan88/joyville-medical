"use client"

import { useSidebar } from "@/stores/stores";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/lib/axios";
import PaymentDetail from "@/components/payments/payment-detail";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { LucideLoader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import PaginationTabel from "@/components/pagination-tabel";
import { useSession } from "next-auth/react";
import { forbidden } from "next/navigation";

type PrescriptionType = {
    id: number;
    medicine: {
        id: number;
        name: string;
        price: number;
    };
    quantity: number;
    status: "PENDING" | "COMPLETED" | "CANCELLED" | string;
}

type PaymentAppointmentType = {
    id: number;
    patient: {
        name: string;
    };
    doctor: {
        name: string;
    };
    appointmentDate: string;
    prescription: PrescriptionType[];
    diagnosis: string;
}

export default function PaymentPage() {
    const { isSidebarOpen } = useSidebar((state) => state);
    const { data: session } = useSession();
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const itemsPerPage = 10;

    if (!["CASHIER", "SUPER_ADMIN"].includes(session?.user?.role as string)) {
        forbidden()
    }

    const { data: dataPendingPayments, isLoading: loadingPendingPayments } = useQuery({
        queryKey: ["pending-payments"],
        queryFn: async () => {
            const response = await axiosInstance.get("/appointments/pending-payments");
            return response.data.data;
        }
    });

    const filteredData = useMemo<PaymentAppointmentType[]>(() => {
        const list = dataPendingPayments ?? [];
        if (!debouncedSearch) return list;

        return list.filter((payment: PaymentAppointmentType) =>
            payment.patient.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [dataPendingPayments, debouncedSearch]);

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
                        <BreadcrumbPage className="font-semibold dark:text-slate-100">Payment</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-slate-100">Payments</h1>

            <div className="mt-4 sm:mt-7 px-3 sm:px-6 pt-2 pb-7 bg-white rounded-xl dark:bg-slate-900 dark:border-slate-700">
                <div className="flex flex-col md:flex-row  md:items-center justify-between pt-2 pb-4">
                    <h1 className="text-base md:text-lg font-bold mb-3 sm:mb-0 dark:text-slate-100">Payments Management</h1>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <form className="w-full sm:w-auto">
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                                    <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg placeholder:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" placeholder="Search by name..." required value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </form>
                    </div>
                </div>

                {loadingPendingPayments ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <LucideLoader2 className="w-10 h-10 animate-spin text-gray-400" />
                        <p className="mt-4 text-gray-500 text-sm">Loading payments data...</p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-lg overflow-hidden border border-gray-100 dark:bg-slate-900 dark:border-slate-700">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-slate-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-gray-500 px-4 dark:text-slate-300 whitespace-nowrap">ID</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Patient</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">Doctor</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Appointment Date</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Prescription Status</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Total Amount</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!currentData || currentData?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">
                                                No pending payments
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentData?.map((appointment: PaymentAppointmentType, index: number) => (
                                            <TableRow key={appointment.id} className="dark:hover:bg-slate-800">
                                                <TableCell className="font-semibold px-4 dark:text-slate-300 whitespace-nowrap">{index + 1}</TableCell>
                                                <TableCell className="font-semibold dark:text-slate-300 whitespace-nowrap">{appointment.patient.name}</TableCell>
                                                <TableCell className="dark:text-slate-300 whitespace-nowrap hidden md:table-cell">{appointment.doctor.name}</TableCell>
                                                <TableCell className="dark:text-slate-300 whitespace-nowrap">
                                                    {new Date(appointment.appointmentDate).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="dark:text-slate-300 whitespace-nowrap">
                                                    <Badge className={
                                                        appointment.prescription.every((p: PrescriptionType) => p.status === "COMPLETED")
                                                            ? "bg-green-400 dark:bg-green-500 dark:text-slate-100"
                                                            : "bg-blue-400 dark:bg-blue-500 dark:text-slate-100"
                                                    }>
                                                        {appointment.prescription.every((p: PrescriptionType) => p.status === "COMPLETED")
                                                            ? "Payment Successful"
                                                            : "Waiting Payment"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="dark:text-slate-200 whitespace-nowrap">Rp.{appointment.prescription.reduce((total: number, p: PrescriptionType) => total + (p.medicine.price * p.quantity), 0).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <PaymentDetail appointment={appointment} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
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