import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Pelafalan kanji/kosakata memakai Web Speech API (speechSynthesis).
 * Membaca teks dengan suara bahasa Jepang (ja-JP) bila tersedia.
 *
 * @param {string} lang - kode bahasa, default 'ja-JP'
 */
export function useSpeech(lang = 'ja-JP') {
  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window

  const [voices, setVoices] = useState([])

  // Daftar suara dimuat asinkron oleh sebagian browser (dulu 'voiceschanged').
  useEffect(() => {
    if (!supported) return undefined
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  // Utamakan suara Jepang, lalu suara yang kode bahasanya berawalan 'ja'.
  const voice = useMemo(() => {
    if (!voices.length) return null
    const exact = voices.find((v) => v.lang === lang)
    if (exact) return exact
    return voices.find((v) => v.lang?.toLowerCase().startsWith('ja')) ?? null
  }, [voices, lang])

  const hasJapaneseVoice = Boolean(voice)

  const speak = useCallback(
    (text) => {
      if (!supported || !text) return
      const synth = window.speechSynthesis
      synth.cancel() // hentikan bacaan sebelumnya agar tidak menumpuk
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      if (voice) utterance.voice = voice
      utterance.rate = 0.9 // sedikit pelan untuk hafalan
      utterance.pitch = 1
      synth.speak(utterance)
    },
    [supported, lang, voice],
  )

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
  }, [supported])

  return { speak, stop, supported, hasJapaneseVoice }
}

export default useSpeech
