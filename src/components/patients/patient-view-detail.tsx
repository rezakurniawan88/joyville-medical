import { PatientType } from "@/types/patient-types";

export default function PatientViewDetail({ patient }: { patient: PatientType }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-sm font-medium truncate">{patient.name}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID Card Number</p>
                <p className="text-sm font-medium truncate">{patient.idCard}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-sm font-medium truncate">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                <p className="text-sm font-medium truncate">{patient.gender}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Blood Type</p>
                <p className="text-sm font-medium truncate">{patient.bloodType}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                <p className="text-sm font-medium truncate">{patient.phone}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium truncate">{patient.email}</p>
            </div>
            <div className="col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-sm font-medium truncate">{patient.address}</p>
            </div>
        </div>
    )
}
