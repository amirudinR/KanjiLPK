import { useCallback, useEffect, useState } from 'react'

/**
 * Menyimpan hasil & riwayat Game Kanji di localStorage.
 *
 * Struktur tersimpan:
 * {
 *   results: { [levelId]: { [sessionIdx]: { benar, total, skor, at } } },
 *   best:    { [levelId]: number },   // akumulasi skor terbaik per level
 *   history: Array<HistoryEntry>      // terbaru di depan, maks HISTORY_LIMIT
 * }
 */

export const GAME_STORAGE_KEY = 'kanji-hafalan-game-v1'
export const HISTORY_LIMIT = 60

function emptyState() {
  return { results: {}, best: {}, history: [] }
}

function sanitize(raw) {
  if (!raw || typeof raw !== 'object') return emptyState()
  const results =
    raw.results && typeof raw.results === 'object' && !Array.isArray(raw.results)
      ? raw.results
      : {}
  const best =
    raw.best && typeof raw.best === 'object' && !Array.isArray(raw.best)
      ? raw.best
      : {}
  const history = Array.isArray(raw.history) ? raw.history : []
  return { results, best, history }
}

function readStored() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return emptyState()
    const raw = window.localStorage.getItem(GAME_STORAGE_KEY)
    if (!raw) return emptyState()
    return sanitize(JSON.parse(raw))
  } catch {
    return emptyState()
  }
}

export function useKanjiGameStore() {
  const [state, setState] = useState(readStored)

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      window.localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // abaikan kegagalan penyimpanan (quota / private mode)
    }
  }, [state])

  const saveSession = useCallback((levelId, sessionIdx, result) => {
    setState((prev) => {
      const levelResults = prev.results[levelId] ?? {}
      const prevRes = levelResults[sessionIdx]
      const better =
        !prevRes ||
        result.skor > prevRes.skor ||
        (result.skor === prevRes.skor && result.benar > prevRes.benar)
      const nextLevel = better
        ? { ...levelResults, [sessionIdx]: result }
        : levelResults

      const best = Object.values(nextLevel).reduce((n, r) => n + (r.skor || 0), 0)

      return {
        ...prev,
        results: { ...prev.results, [levelId]: nextLevel },
        best: { ...prev.best, [levelId]: best },
      }
    })
  }, [])

  const addHistory = useCallback((entry) => {
    setState((prev) => ({
      ...prev,
      history: [entry, ...prev.history].slice(0, HISTORY_LIMIT),
    }))
  }, [])

  const clearHistory = useCallback(() => {
    setState((prev) => ({ ...prev, history: [] }))
  }, [])

  const resetLevel = useCallback((levelId) => {
    setState((prev) => {
      const results = { ...prev.results }
      delete results[levelId]
      const best = { ...prev.best }
      delete best[levelId]
      return { ...prev, results, best }
    })
  }, [])

  const resetAll = useCallback(() => setState(emptyState()), [])

  return {
    results: state.results,
    best: state.best,
    history: state.history,
    saveSession,
    addHistory,
    clearHistory,
    resetLevel,
    resetAll,
  }
}

export default useKanjiGameStore
