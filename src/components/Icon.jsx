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
