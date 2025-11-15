import { create } from 'zustand'

interface AppState {
  selectedDealId: string | null
  setSelectedDealId: (id: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedDealId: null,
  setSelectedDealId: (id) => set({ selectedDealId: id }),
}))
