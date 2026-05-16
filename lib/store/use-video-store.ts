import { create } from "zustand"

interface VideoStore {
  seekTime: number | null
  currentTime: number
  setSeekTime: (time: number | null) => void
  setCurrentTime: (time: number) => void
}

export const useVideoStore = create<VideoStore>((set) => ({
  seekTime: null,
  currentTime: 0,
  setSeekTime: (time) => set({ seekTime: time }),
  setCurrentTime: (time) => set({ currentTime: time }),
}))
