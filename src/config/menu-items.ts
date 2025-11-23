import { Role } from "@/generated/prisma"
import { 
  LucideLayoutDashboard, 
  LucideUsersRound,
  LucideSquareUserRound,
  LucideCalendar,
  LucideBriefcaseMedical,
  LucideBanknoteArrowUp
} from "lucide-react"
import { ComponentType } from "react"

type MenuItem = {
  path: string
  label: string
  icon: ComponentType<any>
}

export const menuItems: Partial<Record<Role, MenuItem[]>> = {
  [Role.SUPER_ADMIN]: [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: LucideLayoutDashboard 
    },
    { 
      path: "/employees", 
      label: "Employees", 
      icon: LucideUsersRound 
    },
    { 
      path: "/patients", 
      label: "Patients", 
      icon: LucideSquareUserRound 
    },
    { 
      path: "/appointments", 
      label: "Appointments", 
      icon: LucideCalendar 
    },
    { 
      path: "/medicines", 
      label: "Medicines", 
      icon: LucideBriefcaseMedical 
    },
    { 
      path: "/payments", 
      label: "Payments", 
      icon: LucideBanknoteArrowUp 
    },
  ],
  [Role.ADMIN]: [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: LucideLayoutDashboard 
    },
    { 
      path: "/patients", 
      label: "Patients", 
      icon: LucideSquareUserRound 
    },
  ],
  [Role.DOCTOR]: [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: LucideLayoutDashboard 
    },
    { 
      path: "/appointments", 
      label: "Appointments", 
      icon: LucideCalendar 
    },
  ],
  [Role.APPOTHECARY]: [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: LucideLayoutDashboard 
    },
    { 
      path: "/medicines", 
      label: "Medicines", 
      icon: LucideBriefcaseMedical 
    },
  ],
  [Role.CASHIER]: [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: LucideLayoutDashboard 
    },
    { 
      path: "/payments", 
      label: "Payments", 
      icon: LucideBanknoteArrowUp 
    },
  ],
}