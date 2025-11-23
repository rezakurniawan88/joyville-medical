import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ doctorId: string }>}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { doctorId } = await params;

        if(session.user.role === "DOCTOR") {
            const doctorSchedules = await prisma.appointment.findMany({
                where: {
                    doctorId: Number(doctorId)
                },
                include: {
                    patient: true,
                    prescription: true
                }
            });
    
            return NextResponse.json({
                data: doctorSchedules,
                message: "Get Doctor's Appointments Successfully"
            }, {
                status: 200
            })
        } else if(session.user.role === "SUPER_ADMIN") {
            const doctorSchedulesAll = await prisma.appointment.findMany({
                include: {
                    patient: true,
                    prescription: true,
                    doctor: true
                }
            })

            return NextResponse.json({
                data: doctorSchedulesAll,
                message: "Get Doctor's Appointments Successfully"
            }, {
                status: 200
            })
        } else {
            return NextResponse.json({
                message: "Forbidden"
            })
        }

    } catch (error) {
        if(error instanceof Error) {
            return NextResponse.json({
                status: "error",
                message: error.message
            },
        {
            status: 500
        })
        }
    }
}