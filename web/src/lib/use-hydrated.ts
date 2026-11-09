"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

// false во время серверного рендера и гидрации, true после — защищает от расхождения с localStorage
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
