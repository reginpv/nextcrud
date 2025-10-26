import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Mode = {
  mode: string
  setMode: (payload: Mode) => void
  toggleMode: () => void
}

const initialState = 'light'

export const useMode = create<Mode>()(
  persist(
    (set) => ({
      mode: initialState,
      setMode: (payload: Mode) => set(payload),
      toggleMode: () =>
        set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: `ncmode${process.env.NODE_ENV === 'development' ? '-dev' : ''}`,
    }
  )
)
