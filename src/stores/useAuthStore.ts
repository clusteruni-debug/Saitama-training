import { create } from 'zustand'
import type { User } from 'firebase/auth'

type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error'

interface AuthState {
  user: User | null
  syncStatus: SyncStatus
  setUser: (user: User | null) => void
  setSyncStatus: (status: SyncStatus) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  syncStatus: 'offline',
  setUser: (user) => set({ user }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
}))
