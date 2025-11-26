import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

type PrescriptionType = {
    medicineId: number;
    quantity: number;
    note?: string;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ appointmentId: string }>}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { status, diagnosis, prescriptions } = await req.json();
        const { appointmentId } = await params;

        if(session.user.role === "DOCTOR" || session.user.role === "SUPER_ADMIN") {
            const result = await prisma.$transaction(async (tx) => {
                await prisma.appointment.update({
                    where: {
                        id: Number(appointmentId)
                    },
                    data: {
                        status,
                        diagnosis,
                    }
                });
    
                if(prescriptions && prescriptions.length > 0) {
                    await tx.prescription.createMany({
                        data: prescriptions.map((prescription: PrescriptionType) => ({
                            appointmentId: Number(appointmentId),
                            medicineId: prescription.medicineId,
                            quantity: prescription.quantity,
                            note: prescription.note || null
                        }))
                    });
                }
    
                return await tx.appointment.findUnique({
                    where: {
                        id: Number(appointmentId)
                    },
                    include: {
                        prescription: {
                            include: {
                                medicine: true
                            }
                        }
                    }
                })
            })
    
            return NextResponse.json({
                data: result,
                message: "Update Appointment Status Successfully"
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
        }
        console.log(error, "UPDATE_APPOINTMENT_STATUS_ERROR");        
    }
}