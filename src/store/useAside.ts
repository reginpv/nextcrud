import { create } from 'zustand'

type AsideState = {
  minimize: boolean
  setMinimize: (payload: boolean) => void
  toggleMinimize: () => void
}

const initialState = false

export const useAside = create<AsideState>()((set) => ({
  minimize: initialState,
  setMinimize: (payload: boolean) => set({ minimize: payload }),
  toggleMinimize: () => set((state) => ({ minimize: !state.minimize })),
}))
