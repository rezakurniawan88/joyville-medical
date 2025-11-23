import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ patientId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { patientId } = await params;

        if(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
            await prisma.patient.delete({
                where: {
                    id: Number(patientId)
                }
            });
    
            return NextResponse.json({
                message: "Patient deleted successfully"
            }, {
                status: 200
            })
        } else {
            return NextResponse.json({
                message: "Forbidden"
            }, {
                status: 403
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
        console.log(error, "DELETE_PATIENT_ERROR");        
    }
}