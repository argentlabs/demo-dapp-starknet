const ChevronRight = () => (
  <svg
    className="w-4 h-4 transition-transform duration-[200] -rotate-90"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
)

const ChevronLeft = () => (
  <svg
    className="w-4 h-4transition-transform duration-[200] -rotate-270"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
)

const ChevronUp = () => (
  <svg
    className="w-4 h-4 transition-transform duration-[200] -rotate-180"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
)

const ChevronDown = () => (
  <svg
    className="w-4 h-4 transition-transform duration-[200]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
)

export { ChevronRight, ChevronLeft, ChevronUp, ChevronDown }
