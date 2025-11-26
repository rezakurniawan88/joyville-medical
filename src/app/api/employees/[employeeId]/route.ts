import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/generated/prisma";

type UpdateDataType = {
    name: string;
    email: string;
    role: Role;
    password?: string;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ employeeId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { employeeId } = await params;
        const { name, email, role, password } = await req.json();

        const updateData: UpdateDataType = {
            name,
            email,
            role: role as Role,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if(session.user.role === "SUPER_ADMIN") {
            const employee = await prisma.user.update({
                where: {
                    id: Number(employeeId),
                },
                data: updateData,
            });
    
            return NextResponse.json({
                data: employee,
                message: "Employee updated successfully"
            });
        } else {
            return NextResponse.json({
                message: "Forbidden"
            }, {
                status: 403
            })
        }

    } catch (error) {
        console.error("UPDATE_EMPLOYEE_ERROR:", error);
        return NextResponse.json(
            { message: "Failed to update employee" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ employeeId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        
        const { employeeId } = await params;

        if(session.user.role === "SUPER_ADMIN") {
            await prisma.user.delete({
                where: {
                    id: Number(employeeId),
                }
            });

            return NextResponse.json({
                message: "Employee deleted successfully"
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
        console.error("DELETE_EMPLOYEE_ERROR:", error);
        return NextResponse.json(
            { message: "Failed to delete employee" },
            { status: 500 }
        );
    }
}