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

        if(session.user.role === "CASHIER" || session.user.role === "SUPER_ADMIN") {
            const appointments = await prisma.appointment.findMany({
                where: {
                    status: "COMPLETED",
                },
                include: {
                    patient: true,
                    doctor: true,
                    prescription: {
                        include: {
                            medicine: true
                        }
                    }
                }
            });
    
            return NextResponse.json({
                data: appointments,
                message: "Pending payments fetched successfully"
            });
        } else {
            return NextResponse.json({
                message: "Forbidden"
            }, {
                status: 403
            })
        }
    } catch (error) {
        console.error("GET_PENDING_PAYMENTS_ERROR:", error);
        return NextResponse.json(
            { message: "Failed to fetch pending payments" },
            { status: 500 }
        );
    }
}