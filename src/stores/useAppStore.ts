import { create } from 'zustand'

interface AppState {
    currentSection: string
    isLoading: boolean
    videoMuted: boolean
    setCurrentSection: (section: string) => void
    setLoading: (loading: boolean) => void
    toggleVideoMute: () => void
}

export const useAppStore = create<AppState>((set) => ({
    currentSection: 'hero',
    isLoading: true,
    videoMuted: true,
    setCurrentSection: (section) => set({ currentSection: section }),
    setLoading: (loading) => set({ isLoading: loading }),
    toggleVideoMute: () => set((state) => ({ videoMuted: !state.videoMuted }))
}))