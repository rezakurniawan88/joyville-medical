import { create } from 'zustand'

type SidebarState = {
    isSidebarOpen: boolean
    toggleSidebar: () => void
}

type ProfileState = {
    isProfileOpen: boolean
    toggleProfile: () => void
}

export const useSidebar = create<SidebarState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))

export const useProfile = create<ProfileState>((set) => ({
  isProfileOpen: false,
  toggleProfile: () => set((state) => ({ isProfileOpen: !state.isProfileOpen })),
}))