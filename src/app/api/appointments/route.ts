import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { patientId, doctorId, appointmentDate, reason} = await req.json();

    if(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
      const appointment = await prisma.appointment.create({
        data: {
          patientId: Number(patientId),
          doctorId: Number(doctorId),
          appointmentDate: new Date(appointmentDate),
          reason
        }
      });
      
      return NextResponse.json({
        data: appointment,
        message: "Appointment created successfully"
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
      },
      { 
        status: 500
      }
    )}
    console.log(error, "CREATE_APPOINTMENT_ERROR");
  }
}