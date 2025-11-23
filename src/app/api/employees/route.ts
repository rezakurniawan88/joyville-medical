import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if(session.user.role === "SUPER_ADMIN") {
            const employees = await prisma.user.findMany({
                where: {
                    NOT: {
                        role: "SUPER_ADMIN"
                    }
                },
                include: {
                    appointments: true
                }
            });
    
            return NextResponse.json({
                data: employees,
                message: "Get Data Employees Successfully"
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
            },
            {
                status: 500
            }
        )}
        console.log(error, "GET_EMPLOYEES_LIST_ERROR");
    }
}