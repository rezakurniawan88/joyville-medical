import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ appointmentId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { appointmentId } = await params;

        if(session.user.role === "CASHIER" || session.user.role === "SUPER_ADMIN") {
            await prisma.$transaction(async (tx) => {
                const prescriptions = await tx.prescription.findMany({
                    where: {
                        appointmentId: parseInt(appointmentId),
                    },
                    include: {
                        medicine: true
                    }
                });

                for (const prescription of prescriptions) {
                    if (prescription.medicine.stock < prescription.quantity) {
                        throw new Error(`Insufficient stock for medicine: ${prescription.medicine.name}`);
                    }
                }

                for (const prescription of prescriptions) {
                    await tx.medicines.update({
                        where: {
                            id: prescription.medicineId
                        },
                        data: {
                            stock: {
                                decrement: prescription.quantity
                            }
                        }
                    });

                    await tx.prescription.update({
                        where: {
                            id: prescription.id
                        },
                        data: {
                            status: "COMPLETED"
                        }
                    });
                }

                await tx.appointment.update({
                    where: {
                        id: parseInt(appointmentId)
                    },
                    data: {
                        status: "COMPLETED"
                    }
                });
            });
    
            return NextResponse.json({
                message: "Payment processed successfully"
            });
        }

        return NextResponse.json({
            message: "Forbidden"
        }, {
            status: 403
        });

    } catch (error) {
        console.error("PROCESS_PAYMENT_ERROR:", error);
        return NextResponse.json(
            { 
                message: error instanceof Error ? error.message : "Failed to process payment"
            },
            { status: 500 }
        );
    }
}