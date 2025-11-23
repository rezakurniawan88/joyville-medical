import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if(!session.user.role) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            )
        }

        const [totalPatients, totalAppointments, totalMedicinesSold, totalRevenue] = await Promise.all([
            prisma.patient.count(),
            prisma.appointment.count(),
            prisma.prescription.aggregate({
                where: {
                    status: "COMPLETED"
                },
                _sum: {
                    quantity: true
                }
            }),
            prisma.prescription.findMany({
                where: {
                    status: "COMPLETED"
                },
                select: {
                    quantity: true,
                    medicine: {
                        select: {
                            price: true
                        }
                    }
                }
            })
        ]);

        const revenue = totalRevenue.reduce((acc, prescription) => {
            return acc + (prescription.quantity * prescription.medicine.price);
        }, 0);

        const monthlyRevenue = await prisma.prescription.findMany({
            where: {
                status: "COMPLETED",
                createdAt: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                    lte: new Date(),
                }
            },
            select: {
                quantity: true,
                medicine: {
                    select: {
                        price: true
                    }
                },
                createdAt: true
            }
        });

        const recentAppointments = await prisma.appointment.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                appointmentDate: true,
                patient: {
                    select: {
                        name: true
                    }
                },
                doctor: {
                    select: {
                        name: true
                    }
                },
                prescription: {
                    select: {
                        medicine: {
                            select: {
                                name: true,
                                price: true
                            }
                        },
                        quantity: true
                    }
                }
            }
        });

        const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => ({
            name: new Date(0, i).toLocaleString('default', { month: 'short' }),
            total: 0
        }));

        monthlyRevenue.forEach((prescription) => {
            const month = prescription.createdAt.getMonth();
            const revenue = prescription.quantity * prescription.medicine.price;
            monthlyRevenueData[month].total += revenue;
        });

        const formattedAppointments = recentAppointments.map(apt => ({
            id: apt.id,
            patient: apt.patient.name,
            doctor: apt.doctor.name,
            status: apt.status,
            date: apt.appointmentDate,
            revenue: apt.prescription.reduce((sum, p) => 
                sum + (p.quantity * p.medicine.price), 0
            )
        }));

        return NextResponse.json({
            data: {
                totalPatients,
                totalAppointments,
                totalMedicinesSold: totalMedicinesSold._sum.quantity || 0,
                totalRevenue: revenue,
                monthlyRevenue: monthlyRevenueData,
                recentAppointments: formattedAppointments
            },
            message: "Statistics fetched successfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.log("GET_STATISTICS_ERROR", error);
        return NextResponse.json(
            { message: "Failed to fetch statistics" },
            { status: 500 }
        )
    }
}