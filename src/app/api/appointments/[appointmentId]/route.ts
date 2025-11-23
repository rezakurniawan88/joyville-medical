import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ appointmentId: string }>}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { appointmentId } = await params;

        if(!appointmentId) return NextResponse.json({ message: "Appointment ID not found"});

        if(session.user.role === "DOCTOR" || session.user.role === "SUPER_ADMIN") {
            await prisma.appointment.delete({
                where: {
                    id: Number(appointmentId)
                }
            });
    
            return NextResponse.json({
                message: "Appointment Delete Successfully"
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
            }, {
                status: 500
            })
        };
        console.log(error, "DELETE_APPOINTMENT_ERROR");
    }
} 