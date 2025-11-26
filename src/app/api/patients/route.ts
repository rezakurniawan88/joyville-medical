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

        if(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
            const patients = await prisma.patient.findMany({
                include: {
                    appointments: {
                        include: {
                            doctor: true
                        }
                    }
                }
            });
            return NextResponse.json({
                data: patients,
                message: "Patients fetched successfully"
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
        console.log(error, "GET_PATIENTS_ERROR");
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

        const { idCard, name, dateOfBirth, gender, address, phone, email, bloodType } = await req.json();
        const parsedDate = new Date(dateOfBirth).toISOString();

        if(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
            const patient = await prisma.patient.create({
                data: {
                    idCard,
                    name,
                    dateOfBirth: parsedDate,
                    gender,
                    address,
                    phone,
                    email,
                    bloodType
                }
            });
    
            return NextResponse.json({ 
                data: patient,
                message: "Patient created successfully"
            }, {
                status: 201
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
        console.log(error, "CREATE_PATIENT_ERROR");
    }
}