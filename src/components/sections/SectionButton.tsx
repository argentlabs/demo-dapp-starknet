import { FC } from "react"
import { Button } from "../ui/Button"
import { Section } from "./types"

interface SectionButtonProps {
  disabled?: boolean
  section: Section
  label?: string
  selected: boolean
  className?: string
  setSection: (
    value?:
      | ((prevState?: Section | undefined) => Section | undefined)
      | undefined,
  ) => void
}

const SectionButton: FC<SectionButtonProps> = ({
  disabled,
  section,
  label,
  selected,
  setSection,
  className,
}) => (
  <Button
    responsiveChevron
    selected={selected}
    className={`text-medium-grey justify-between ${disabled ? "disabled" : ""} ${selected ? "bg-raisin-black" : "bg-black"} 
      ${className}`}
    disabled={disabled}
    onClick={() => {
      setSection((prev?: Section | undefined) =>
        prev === section ? undefined : section,
      )
    }}
  >
    {label || section}
  </Button>
)

export { SectionButton }
