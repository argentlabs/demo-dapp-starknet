import React, { FC } from "react"

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onClick: () => void
  withBorder?: boolean
}

const AccordionItem: FC<AccordionItemProps> = ({
  title,
  children,
  isOpen,
  onClick,
  withBorder,
}) => {
  return (
    <div>
      <button
        className={`accordion-button ${withBorder ? "accordion-button-with-border" : ""}`}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span
          className={`accordion-title ${withBorder ? "accordion-title-with-border" : ""}`}
        >
          {title}
        </span>
        <svg
          className={`accordion-icon ${isOpen ? "accordion-icon-open" : ""}`}
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
      </button>
      <div
        className={`accordion-content ${isOpen ? "accordion-content-open" : ""}`}
      >
        <div>{children}</div>
      </div>
    </div>
  )
}

export { AccordionItem }
