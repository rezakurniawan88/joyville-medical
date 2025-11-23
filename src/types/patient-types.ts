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
    appointments?: any[]
}