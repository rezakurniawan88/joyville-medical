"use client"

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSidebar } from '@/stores/stores';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import PatientDetail from '@/components/patients/patient-detail';
import PatientDeleteModal from '@/components/patients/patient-delete-modal';
import { PatientType } from '@/types/patient-types';
import { LucideLoader2, LucidePlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import PaginationTabel from '@/components/pagination-tabel';
import { useSession } from 'next-auth/react';
import { forbidden } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function PatientsPage() {
    const { isSidebarOpen } = useSidebar((state) => state);
    const { data: session } = useSession();
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const itemsPerPage = 10;

    if (!["ADMIN", "SUPER_ADMIN"].includes(session?.user?.role as string)) {
        forbidden()
    }

    const { data: dataPatients, isLoading: loadingDataPatients, refetch: refetchDataPatient } = useQuery({
        queryKey: ["patients"],
        queryFn: async () => {
            const response = await axiosInstance.get("/patients");
            return response?.data?.data;
        }
    })

    const filteredData = useMemo(() => {
        if (!dataPatients) return [];
        if (!debouncedSearch) return dataPatients;

        return dataPatients.filter((patient: PatientType) =>
            patient.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || patient.idCard.includes(debouncedSearch)
        );
    }, [dataPatients, debouncedSearch])

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
                        <BreadcrumbPage className="font-semibold dark:text-slate-100">Patients</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-slate-100">Patients</h1>

            <div className="mt-4 sm:mt-7 px-3 sm:px-6 pt-2 pb-7 bg-white rounded-xl dark:bg-slate-900 dark:border-slate-700">
                <div className="flex flex-col md:flex-row  md:items-center justify-between gap-4 pt-2 pb-4">
                    <h1 className="text-base md:text-lg font-bold dark:text-slate-100">Patients Management</h1>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <form className="w-full sm:w-auto">
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                                    <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg placeholder:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" placeholder="Search by name or ID..." required value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </form>
                        <Link href="/patients/create">
                            <Button className="bg-blue-500 text-xs text-white font-bold flex gap-2 hover:bg-blue-600 cursor-pointer">
                                <LucidePlusCircle />
                                <h1>Add Patient</h1>
                            </Button>
                        </Link>
                    </div>
                </div>
                {loadingDataPatients ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <LucideLoader2 className="w-10 h-10 animate-spin text-gray-400" />
                        <p className="mt-4 text-gray-500 text-sm">Loading patients data...</p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="rounded-lg border border-gray-100 dark:border-slate-700">
                            <div className="relative">
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-slate-800">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="text-gray-500 dark:text-slate-300 w-[50px]">No</TableHead>
                                            <TableHead className="text-gray-500 dark:text-slate-300">ID</TableHead>
                                            <TableHead className="text-gray-500 dark:text-slate-300">Name</TableHead>
                                            <TableHead className="text-gray-500 dark:text-slate-300 hidden md:table-cell">Gender</TableHead>
                                            <TableHead className="text-gray-500 dark:text-slate-300">Phone Number</TableHead>
                                            <TableHead className="text-gray-500 dark:text-slate-300 hidden md:table-cell">Email</TableHead>
                                            <TableHead className="text-gray-500 dark:text-slate-300 hidden md:table-cell">Address</TableHead>
                                            <TableHead className="text-gray-500 dark:text-slate-300 sticky right-0 bg-gray-50 dark:bg-slate-800">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!currentData || currentData?.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center">No patients found.</TableCell>
                                            </TableRow>
                                        ) : currentData?.map((patient: PatientType, index: number) => (
                                            <TableRow key={index} className="dark:hover:bg-slate-800">
                                                <TableCell className="font-medium dark:text-slate-300 whitespace-nowrap">{index + 1}</TableCell>
                                                <TableCell className="dark:text-slate-300 whitespace-nowrap">{patient.idCard}</TableCell>
                                                <TableCell className="font-semibold dark:text-slate-300 whitespace-nowrap">{patient.name}</TableCell>
                                                <TableCell className="dark:text-slate-300 whitespace-nowrap hidden md:table-cell">{patient.gender}</TableCell>
                                                <TableCell className="dark:text-slate-300 whitespace-nowrap">{patient.phone}</TableCell>
                                                <TableCell className="dark:text-slate-300 whitespace-nowrap hidden md:table-cell">{patient.email}</TableCell>
                                                <TableCell className="dark:text-slate-300 whitespace-nowrap hidden md:table-cell">{patient.address}</TableCell>
                                                <TableCell className="sticky right-0 bg-white dark:bg-slate-900">
                                                    <div className="flex items-center gap-2">
                                                        <PatientDetail patient={patient} refetch={refetchDataPatient} />
                                                        <PatientDeleteModal patientId={patient.id} refetch={refetchDataPatient} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <div className="mt-4">
                            <PaginationTabel
                                page={page}
                                totalItems={totalItems}
                                totalPages={totalPages}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                setPage={setPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
