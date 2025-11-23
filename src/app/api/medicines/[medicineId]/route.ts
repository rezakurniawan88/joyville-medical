import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ medicineId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { medicineId } = await params;
        const { name, description, price, stock } = await req.json();

        if(session.user.role === "APPOTHECARY" || session.user.role === "SUPER_ADMIN") {
            const medicine = await prisma.medicines.update({
                where: {
                    id: Number(medicineId)
                },
                data: {
                    name,
                    description,
                    price: Number(price),
                    stock: Number(stock)
                }
            });
    
            return NextResponse.json({
                data: medicine,
                message: "Medicine Updated Successfully"
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
        console.log(error, "UPDATE_MEDICINE_ERROR");
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ medicineId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { medicineId } = await params;
        
        if(session.user.role === "APPOTHECARY" || session.user.role === "SUPER_ADMIN") {
            await prisma.medicines.delete({
                where: {
                    id: Number(medicineId)
                }
            });

            return NextResponse.json({
                message: "Medicine Deleted Successfully"
            }, {
                status: 200
            });
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
        console.log(error, "DELETE_MEDICINE_ERROR");
    }
}