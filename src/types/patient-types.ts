type appointmentDetailProps = {
    id: number;
    patient: {
        id: number;
        name: string;
    };
    doctor: {
        id: number;
        name: string;
    };
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    revenue: number;
}

export type PatientType = {
    id: number
    idCard: string
    name: string
    dateOfBirth: Date
    gender: string
    address: string
    phone: string
    email: string
    bloodType: string
    appointments?: appointmentDetailProps[]
}