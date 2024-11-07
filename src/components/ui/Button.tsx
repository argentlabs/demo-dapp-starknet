import { ButtonHTMLAttributes, FC } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hideChevron?: boolean
}

const Button: FC<ButtonProps> = ({
  onClick,
  children,
  style,
  hideChevron,
  ...props
}) => (
  <button
    style={{
      ...style,
    }}
    {...props}
    onClick={onClick}
  >
    {children}

    {!hideChevron && (
      <svg
        className="chevron-right"
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
    )}
  </button>
)

export { Button }
