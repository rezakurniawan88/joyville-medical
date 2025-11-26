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

        if(session.user.role === "APPOTHECARY" || session.user.role === "SUPER_ADMIN") {
            const medicines = await prisma.medicines.findMany();
            return NextResponse.json({
                data: medicines,
                message: "Get medicines successfully"
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
        console.log(error, "GET_MEDICINE_ERROR");        
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name, description, price, stock } = await req.json();

        if(session.user.role === "APPOTHECARY" || session.user.role === "SUPER_ADMIN") {
            const medicine = await prisma.medicines.create({
                data: {
                    name,
                    description,
                    price: Number(price),
                    stock: Number(stock)
                }
            });
    
            return NextResponse.json({
                data: medicine,
                message: "Medicine created successfully"
            }, {
                status: 201
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
        console.log(error, "CREATE_MEDICINE_ERROR");
    }
}