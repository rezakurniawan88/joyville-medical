"use client"

import EmployeeCreateModal from "@/components/employees/employee-create-modal";
import EmployeeDeleteModal from "@/components/employees/employee-delete-modal";
import EmployeeEditModal from "@/components/employees/employee-edit-modal";
import PaginationTabel from "@/components/pagination-tabel";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import axiosInstance from "@/lib/axios";
import { useSidebar } from "@/stores/stores";
import { useQuery } from "@tanstack/react-query";
import { LucideComputer, LucideDollarSign, LucideLoader2, LucidePill, LucideStethoscope, LucideUser } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { forbidden } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type EmployeesType = {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function EmployeesPage() {
    const { isSidebarOpen } = useSidebar((state) => state);
    const { data: session } = useSession();
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const itemsPerPage = 10;

    if (session?.user?.role !== "SUPER_ADMIN") {
        forbidden()
    }

    const { data: dataEmployees, isPending: loadingDataEmployees, refetch: refetchDataEmployee } = useQuery({
        queryKey: ["getEmployees"],
        queryFn: async () => {
            const response = await axiosInstance.get("/employees");
            return response?.data?.data;
        }
    });

    const filteredData = useMemo(() => {
        if (!dataEmployees) return [];
        if (!debouncedSearch) return dataEmployees;

        return dataEmployees.filter((employee: EmployeesType) =>
            employee.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [dataEmployees, debouncedSearch]);

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
            <Breadcrumb className="mt-8 mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="font-semibold dark:text-slate-400">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold dark:text-slate-100">Employees</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-slate-100">Employees</h1>

            <div className="mt-4 sm:mt-7 px-3 sm:px-6 pt-2 pb-7 bg-white rounded-xl dark:bg-slate-900 dark:border-slate-700">
                <div className="flex flex-col md:flex-row  md:items-center justify-between gap-4 pt-2 pb-4">
                    <h1 className="text-base md:text-lg font-bold dark:text-slate-100">Employees List</h1>
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
                        <EmployeeCreateModal refetch={refetchDataEmployee} />
                    </div>
                </div>

                {loadingDataEmployees ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <LucideLoader2 className="w-10 h-10 animate-spin text-gray-400" />
                        <p className="mt-4 text-gray-500 text-sm">Loading employees data...</p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-lg overflow-hidden border border-gray-100 dark:bg-slate-900 dark:border-slate-700">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-slate-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-gray-500 px-4 first:rounded-tl-lg dark:text-slate-300 whitespace-nowrap">ID</TableHead>
                                        <TableHead className="text-gray-500 px-4 dark:text-slate-300 whitespace-nowrap">Name</TableHead>
                                        <TableHead className="text-gray-500 px-4 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">Email</TableHead>
                                        <TableHead className="text-gray-500 px-4 dark:text-slate-300 whitespace-nowrap">Role</TableHead>
                                        <TableHead className="text-gray-500 px-4 last:rounded-tr-lg dark:text-slate-300 whitespace-nowrap">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!currentData || currentData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                No Employees Data
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentData.map((employee: EmployeesType, index: number) => (
                                            <TableRow key={employee.id} className="dark:hover:bg-slate-800">
                                                <TableCell className="font-medium py-3 md:py-4 px-4 dark:text-slate-300 whitespace-nowrap">
                                                    {startIndex + index + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold px-4 dark:text-slate-300 whitespace-nowrap">{employee.name}</TableCell>
                                                <TableCell className="px-4 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">{employee.email}</TableCell>
                                                <TableCell className="px-4 dark:text-slate-300 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        {employee.role === "ADMIN" ? (
                                                            <LucideComputer className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                        ) : employee.role === "DOCTOR" ? (
                                                            <LucideStethoscope className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                        ) : employee.role === "APPOTHECARY" ? (
                                                            <LucidePill className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                        ) : employee.role === "CASHIER" ? (
                                                            <LucideDollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                        ) : <LucideUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                                                        <h1 className="text-xs">{employee.role}</h1>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex items-center gap-2 py-2">
                                                    <EmployeeEditModal employee={employee} refetch={refetchDataEmployee} />
                                                    <EmployeeDeleteModal employeeId={Number(employee.id)} refetch={refetchDataEmployee} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 overflow-x-auto">
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
                )
                }
            </div>
        </div>
    );
}