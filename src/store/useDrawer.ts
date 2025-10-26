import { create } from 'zustand'

type DrawerState = {
  show: boolean
  setShow: (payload: boolean) => void
  toggleShow: () => void
}

const initialState = false

export const useDrawer = create<DrawerState>()((set) => ({
  show: initialState,
  setShow: (payload: boolean) => set({ show: payload }),
  toggleShow: () => set((state) => ({ show: !state.show })),
}))
