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
  return { results: {}, best: {}, bestSessions: {}, history: [] }
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
  const bestSessions =
    raw.bestSessions &&
    typeof raw.bestSessions === 'object' &&
    !Array.isArray(raw.bestSessions)
      ? raw.bestSessions
      : {}
  const history = Array.isArray(raw.history) ? raw.history : []
  return { results, best, bestSessions, history }
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
      // `results` = hasil run TERAKHIR tiap sesi (dipakai layar Hasil).
      // `best` = akumulasi skor TERBAIK tiap sesi level (dipakai statistik).
      const nextLevel = { ...levelResults, [sessionIdx]: result }

      const prevBest = prev.bestSessions?.[levelId] ?? {}
      const prevBestRes = prevBest[sessionIdx]
      const better =
        !prevBestRes ||
        result.skor > prevBestRes.skor ||
        (result.skor === prevBestRes.skor && result.benar > prevBestRes.benar)
      const nextBestSessions = better
        ? { ...prevBest, [sessionIdx]: result }
        : prevBest

      const best = Object.values(nextBestSessions).reduce(
        (n, r) => n + (r.skor || 0),
        0,
      )

      return {
        ...prev,
        results: { ...prev.results, [levelId]: nextLevel },
        bestSessions: { ...prev.bestSessions, [levelId]: nextBestSessions },
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
      const bestSessions = { ...prev.bestSessions }
      delete bestSessions[levelId]
      return { ...prev, results, best, bestSessions }
    })
  }, [])

  const resetAll = useCallback(() => setState(emptyState()), [])

  return {
    results: state.results,
    best: state.best,
    bestSessions: state.bestSessions,
    history: state.history,
    saveSession,
    addHistory,
    clearHistory,
    resetLevel,
    resetAll,
  }
}

export default useKanjiGameStore
