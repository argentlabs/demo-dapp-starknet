import { FC, useEffect } from "react"

const Toast: FC<{
  message: string
  show: boolean
  hide: () => void
}> = ({ message, show, hide }) => {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        hide()
      }, 2000)
    }
  }, [show])

  return (
    <div className="p-4">
      <div
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center p-3 rounded  bg-raisin-black text-white transition-opacity duration-300 shadow-lg ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <svg
          className="w-5 h-5 text-[#90EAC4] mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}

export { Toast }
