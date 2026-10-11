import { useCallback, useEffect, useMemo, useState } from 'react'

export const STORAGE_KEY = 'kanji-hafalan-progress-v1'
export const STREAK_KEY = 'kanji-hafalan-streak-v1'

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

function readStoredStreak() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return { count: 0, lastDate: null }
    const raw = window.localStorage.getItem(STREAK_KEY)
    if (!raw) return { count: 0, lastDate: null }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { count: 0, lastDate: null }
    return {
      count: typeof parsed.count === 'number' ? parsed.count : 0,
      lastDate: typeof parsed.lastDate === 'string' ? parsed.lastDate : null,
    }
  } catch {
    return { count: 0, lastDate: null }
  }
}

function getLocalDateStr(date = new Date()) {
  // YYYY-MM-DD berdasarkan waktu LOKAL (bukan UTC) supaya pergantian hari
  // sesuai jam pengguna, bukan jam UTC.
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getTodayStr() {
  return getLocalDateStr()
}

function getYesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return getLocalDateStr(d)
}

export function useProgress(totalItems = 0) {
  const [progress, setProgress] = useState(readStoredProgress)
  const [streak, setStreak] = useState(readStoredStreak)

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // ignore write failures (quota, privacy mode, SSR)
    }
  }, [progress])

  // Perbarui streak sekali per hari. Dijalankan di effect (bukan saat render)
  // supaya tidak menulis localStorage / setState di tengah render.
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      const today = getTodayStr()
      if (streak.lastDate === today) return
      const newCount = streak.lastDate === getYesterdayStr() ? streak.count + 1 : 1
      const newStreak = { count: newCount, lastDate: today }
      window.localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak))
      setStreak(newStreak)
    } catch {
      // ignore
    }
    // streak sengaja tidak dijadikan dependency: hanya perlu dicek saat mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    setStreak({ count: 0, lastDate: null })
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STREAK_KEY)
      }
    } catch {
      // ignore
    }
  }, [])

  const exportProgress = useCallback(() => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      progress,
      streak,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kanji-hafalan-backup-${getTodayStr()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [progress, streak])

  const importProgress = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      if (!data || typeof data !== 'object') return false
      if (data.progress && typeof data.progress === 'object') {
        const cleaned = {}
        for (const [id, status] of Object.entries(data.progress)) {
          if (status === STATUS.KNOWN || status === STATUS.LEARNING) {
            cleaned[id] = status
          }
        }
        setProgress(cleaned)
      }
      if (data.streak && typeof data.streak === 'object') {
        setStreak({
          count: typeof data.streak.count === 'number' ? data.streak.count : 0,
          lastDate: typeof data.streak.lastDate === 'string' ? data.streak.lastDate : null,
        })
      }
      return true
    } catch {
      return false
    }
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
    exportProgress,
    importProgress,
    progress,
    counts,
    streak,
  }
}

export default useProgress
