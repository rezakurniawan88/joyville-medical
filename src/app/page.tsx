"use client"

import { useSidebar } from "@/stores/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideCalendar, LucideUsers, LucidePill, LucideDollarSign, LucideLoader2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Badge } from "@/components/ui/badge";

type AppointmentType = {
  id: number;
  patient: string;
  doctor: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  revenue: number;
}

export default function Home() {
  const { isSidebarOpen } = useSidebar((state) => state);

  const { data: statistics, isLoading: loadingStatistics } = useQuery({
    queryKey: ['dashboard-statistics'],
    queryFn: async () => {
      const response = await axiosInstance.get('/statistics');
      return response.data.data;
    }
  });

  return (
    <div className={`flex-1 pt-16 md:pt-6 pb-8 transition-all duration-300 dark:bg-[#111b35] p-6 ${isSidebarOpen ? "ml-50 sm:ml-64" : "ml-16"}`}>
      <Breadcrumb className="mt-8 sm:mt-20 mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="font-semibold dark:text-slate-400">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold dark:text-slate-100">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl md:text-3xl font-bold dark:text-slate-100">Overview</h1>
      <div className="grid gap-4 pt-4 md:pt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-100 shadow-xs dark:bg-slate-900 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-300">Total Patients</CardTitle>
            <LucideUsers className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{loadingStatistics ? (
                <LucideLoader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : statistics?.totalPatients}</div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Total registered patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-xs dark:bg-slate-900 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-300">Appointments</CardTitle>
            <LucideCalendar className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{loadingStatistics ? (
                <LucideLoader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : statistics?.totalAppointments}</div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Total appointments</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-xs dark:bg-slate-900 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-300">Medicines Sold</CardTitle>
            <LucidePill className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{loadingStatistics ? (
                <LucideLoader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : statistics?.totalMedicinesSold}</div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Total medicines sold</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-xs dark:bg-slate-900 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-300">Revenue</CardTitle>
            <LucideDollarSign className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{loadingStatistics ? (
                <LucideLoader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : `Rp. ${statistics?.totalRevenue.toLocaleString()}`}</div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Total revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 md:mt-6 border-gray-100 shadow-xs dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Monthly Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          {loadingStatistics ? (
            <div className="flex items-center justify-center h-[200px] md:h-[300px]">
              <LucideLoader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250} className="mt-4">
              <BarChart data={statistics?.monthlyRevenue}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tick={{ fontSize: 10 }} tickFormatter={(value) => value.substring(0, 3)} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(0)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    }
                    return value;
                  }}
                />
                <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4 md:mt-6 border-gray-100 shadow-xs dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-base md:text-lg">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6 overflow-auto -mt-4">
          {loadingStatistics ? (
            <div className="flex items-center justify-center h-[200px]">
              <LucideLoader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Patient</TableHead>
                    <TableHead className="whitespace-nowrap">Doctor</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statistics?.recentAppointments?.map((apt: AppointmentType) => (
                    <TableRow key={apt.id} className="text-xs md:text-sm dark:text-slate-300 dark:hover:bg-slate-800">
                      <TableCell className="whitespace-nowrap">{apt.patient}</TableCell>
                      <TableCell className="whitespace-nowrap">{apt.doctor}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className={
                          apt.status === "COMPLETED" ? "bg-green-400 text-[0.6rem] sm:text-xs dark:text-slate-100" : apt.status === "SCHEDULED" ? "bg-blue-400 text-[0.6rem] sm:text-xs dark:text-slate-100" : "bg-red-400 text-[0.6rem] sm:text-xs dark:text-slate-100"
                        }>
                          {apt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{apt.revenue === 0 ? "-" : `Rp. ${apt.revenue?.toLocaleString()}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}