/* Ikon SVG satu gaya (stroke 2, ujung bulat). */
const PATHS = {
  card: (
    <>
      <rect x="3" y="6" width="15" height="12" rx="2" />
      <rect x="7" y="9" width="14" height="11" rx="2" />
    </>
  ),
  quiz: (
    <>
      <path d="M9.2 9a3 3 0 1 1 3.8 2.9c-.8.3-1 .9-1 1.6v.3" />
      <circle cx="12" cy="17.5" r="0.6" />
      <circle cx="12" cy="12" r="9.2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 20v-5" />
      <path d="M13 20v-9" />
      <path d="M18 20v-6" />
    </>
  ),
  star: (
    <path d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.9 6.7 19.5l1.1-6L3.4 9.3l6-.8Z" />
  ),
  reset: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4h4" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </>
  ),
  moon: <path d="M20 14.4A8.2 8.2 0 1 1 9.6 4a6.6 6.6 0 0 0 10.4 10.4Z" />,
  type: (
    <>
      <path d="M5 7V5h14v2" />
      <path d="M12 5v14" />
      <path d="M9 19h6" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9.5v5a1 1 0 0 0 1 1h2.6L12 19V5L7.6 8.5H5a1 1 0 0 0-1 1Z" />
      <path d="M16 8.6a4.5 4.5 0 0 1 0 6.8" />
      <path d="M18.8 6a8 8 0 0 1 0 12" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 21h16" />
    </>
  ),
  upload: (
    <>
      <path d="M12 21V9" />
      <path d="m7 14 5-5 5 5" />
      <path d="M4 3h16" />
    </>
  ),
  /* --- Game Kanji --- */
  game: (
    <>
      <path d="M7 12h4M9 10v4" />
      <circle cx="15.5" cy="11" r="0.6" />
      <circle cx="17.5" cy="13" r="0.6" />
      <path d="M6.8 6h10.4a4.8 4.8 0 0 1 4.7 3.9l.9 6.1a3 3 0 0 1-5.5 2.3l-1-1.5a3 3 0 0 0-2.5-1.3h-3.6a3 3 0 0 0-2.5 1.3l-1 1.5a3 3 0 0 1-5.5-2.3l.9-6.1A4.8 4.8 0 0 1 6.8 6Z" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M9 2h6" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 6H4.5a3 3 0 0 0 3 3" />
      <path d="M17 6h2.5a3 3 0 0 1-3 3" />
      <path d="M12 14v3" />
      <path d="M8.5 21h7" />
      <path d="M10 17h4l.5 4h-5Z" />
    </>
  ),
  crown: (
    <>
      <path d="M4 17 3 7l5 4 4-6 4 6 5-4-1 10Z" />
      <path d="M5 20h14" />
    </>
  ),
  fire: (
    <path d="M12 3s4.5 3.5 4.5 8a4.5 4.5 0 0 1-9 0c0-1.4.6-2.7 1.4-3.7.4 1 1 1.7 1.6 2 .6-2.4 1.5-4.6 1.5-6.3Zm0 17a6 6 0 0 0 6-6" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="15" r="5" />
      <path d="M12 13v4M10.5 14.5 12 13l1.5 1.5" />
      <path d="M8.5 4h7l-2 5h-3Z" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 5h11l-2 3 2 3H5" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  check: <path d="m5 12 5 5 9-10" />,
  cross: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  play: <path d="M7 4v16l13-8Z" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  back: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  spark: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4l3 2" />
    </>
  ),
}

/**
 * Ikon seragam. `name` memilih bentuk; ukuran bisa diatur lewat `size`.
 * @param {{ name: string, size?: number }} props
 */
function Icon({ name, size = 22 }) {
  const children = PATHS[name]
  if (!children) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default Icon
