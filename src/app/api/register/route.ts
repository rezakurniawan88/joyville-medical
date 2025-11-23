import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, username, password, confirmPassword, role } = await req.json();
        
        if(password !== confirmPassword) return NextResponse.json({ message: "Passwords do not match"}, { status: 400 });

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: username,
                email,
                password: hashPassword,
                role: role ? role : "USER"
            }
        });

        return NextResponse.json({ 
            data: user,
            message: "User Created Successfully"
        }, { 
            status: 201
        });
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
        console.log(error, "REGISTER_ERROR");
    }
}