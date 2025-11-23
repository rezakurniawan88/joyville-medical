import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const doctors = await prisma.user.findMany({
            where: {
                role: "DOCTOR"
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return NextResponse.json({ 
            data: doctors,
            message: "Get doctors successfully"
        }, {
            status: 200
        })
    } catch (error) {
        if(error instanceof Error) {
            return NextResponse.json({
                status: "error",
                message: error.message
            }, {
                status: 500
            })
        }
        console.log(error, "GET_DOCTORS_ERROR");       
    }
}