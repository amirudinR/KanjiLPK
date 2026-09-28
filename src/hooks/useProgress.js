import { useCallback, useEffect, useMemo, useState } from 'react'

export const STORAGE_KEY = 'kanji-hafalan-progress-v1'

export const STATUS = {
  KNOWN: 'known',
  LEARNING: 'learning',
  NEW: 'new',
}

function readStoredProgress() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return {}
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const cleaned = {}
    for (const [id, status] of Object.entries(parsed)) {
      if (status === STATUS.KNOWN || status === STATUS.LEARNING) {
        cleaned[id] = status
      }
    }
    return cleaned
  } catch {
    return {}
  }
}

export function useProgress(totalItems = 0) {
  const [progress, setProgress] = useState(readStoredProgress)

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // ignore write failures (quota, privacy mode, SSR)
    }
  }, [progress])

  const statusFor = useCallback(
    (id) => {
      const status = progress[id]
      return status === STATUS.KNOWN || status === STATUS.LEARNING
        ? status
        : STATUS.NEW
    },
    [progress],
  )

  const setStatus = useCallback((id, status) => {
    setProgress((prev) => {
      if (status === STATUS.KNOWN || status === STATUS.LEARNING) {
        if (prev[id] === status) return prev
        return { ...prev, [id]: status }
      }
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const markKnown = useCallback(
    (id) => setStatus(id, STATUS.KNOWN),
    [setStatus],
  )

  const markLearning = useCallback(
    (id) => setStatus(id, STATUS.LEARNING),
    [setStatus],
  )

  const toggleKnown = useCallback((id) => {
    setProgress((prev) => {
      if (prev[id] === STATUS.KNOWN) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: STATUS.KNOWN }
    })
  }, [])

  const resetAll = useCallback(() => {
    setProgress({})
  }, [])

  const counts = useMemo(() => {
    let known = 0
    let learning = 0
    for (const status of Object.values(progress)) {
      if (status === STATUS.KNOWN) known += 1
      else if (status === STATUS.LEARNING) learning += 1
    }
    return { known, learning, total: totalItems }
  }, [progress, totalItems])

  return {
    statusFor,
    setStatus,
    toggleKnown,
    markKnown,
    markLearning,
    resetAll,
    progress,
    counts,
  }
}

export default useProgress
