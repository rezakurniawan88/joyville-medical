"use client"

import MedicineBreadcrumbs from "@/components/medicines/medicine-breadcrumbs";
import MedicineCreateModal from "@/components/medicines/medicine-create-modal";
import MedicineDeleteModal from "@/components/medicines/medicine-delete-modal";
import MedicineUpdateModal from "@/components/medicines/medicine-update-modal";
import PaginationTabel from "@/components/pagination-tabel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import axiosInstance from "@/lib/axios";
import { useSidebar } from "@/stores/stores";
import { useQuery } from "@tanstack/react-query";
import { LucideLoader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { forbidden } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type MedicineProps = {
    id: number
    name: string
    description: string
    price: number
    stock: number
    createdAt: Date
    updatedAt: Date
}

export default function MedicinePage() {
    const { isSidebarOpen } = useSidebar((state) => state);
    const { data: session } = useSession();
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const itemsPerPage = 10;

    if (!["APPOTHECARY", "SUPER_ADMIN"].includes(session?.user?.role as string)) {
        forbidden()
    }

    const { data: dataMedicines, isLoading: loadingDataMedicines, refetch: refetchDataMedicines } = useQuery({
        queryKey: ["get-medicines"],
        queryFn: async () => {
            const response = await axiosInstance.get("/medicines");
            return response?.data?.data;
        }
    });

    const filteredData = useMemo(() => {
        if (!dataMedicines) return [];
        if (!debouncedSearch) return dataMedicines;

        return dataMedicines.filter((medicine: MedicineProps) =>
            medicine.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [dataMedicines, debouncedSearch]);

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
            <MedicineBreadcrumbs />
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-slate-100">Medicines</h1>

            <div className="mt-4 sm:mt-7 px-3 sm:px-6 pt-2 pb-7 bg-white rounded-xl dark:bg-slate-900 dark:border-slate-700">
                <div className="flex flex-col md:flex-row  md:items-center justify-between pt-2 pb-4">
                    <h1 className="text-base md:text-lg font-bold dark:text-slate-100 mb-3 sm:mb-0">Medicines Management</h1>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <form className="w-full sm:w-auto">
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                                    <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 bg-gray-50 rounded-lg placeholder:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:placeholder:text-slate-400 dark:text-slate-400" placeholder="Search ..." required value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </form>
                        <MedicineCreateModal refetch={refetchDataMedicines} />
                    </div>
                </div>

                {loadingDataMedicines ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <LucideLoader2 className="w-10 h-10 animate-spin text-gray-400" />
                        <p className="mt-4 text-gray-500 text-sm">Loading medicines data...</p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-lg overflow-hidden border border-gray-100 dark:bg-slate-900 dark:border-slate-700">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-slate-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-gray-500 px-4 dark:text-slate-300 whitespace-nowrap">ID</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Name</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">Description</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Price</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Stock</TableHead>
                                        <TableHead className="text-gray-500 dark:text-slate-300 whitespace-nowrap">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!currentData || currentData?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">
                                                No medicines found.
                                            </TableCell>
                                        </TableRow>
                                    ) : currentData?.map((medicine: MedicineProps, index: number) => (
                                        <TableRow key={index} className="dark:hover:bg-slate-800">
                                            <TableCell className="font-medium px-4 dark:text-slate-300 whitespace-nowrap">{index + 1}</TableCell>
                                            <TableCell className="font-medium dark:text-slate-300 whitespace-nowrap">{medicine.name}</TableCell>
                                            <TableCell className="dark:text-slate-300 whitespace-nowrap hidden md:table-cell">{medicine.description}</TableCell>
                                            <TableCell className="dark:text-slate-300 whitespace-nowrap">Rp. {medicine.price.toLocaleString()}</TableCell>
                                            <TableCell className="dark:text-slate-300 whitespace-nowrap">{medicine.stock}</TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <MedicineUpdateModal medicine={medicine} refetch={refetchDataMedicines} />
                                                <MedicineDeleteModal medicineId={medicine.id} refetch={refetchDataMedicines} />
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
