import { Button } from "@/components/ui/Button"
import { FC } from "react"

interface SessionKeysEFOLayoutProps {
  handleSubmit: () => Promise<void>
  copyData: string
  submitDisabled: boolean
  copyDataDisabled: boolean
  title: string
  submitText: string
  copyText: string
}

const SessionKeysEFOLayout: FC<SessionKeysEFOLayoutProps> = ({
  handleSubmit,
  copyData,
  submitDisabled,
  copyDataDisabled,
  title,
  submitText,
  copyText,
}) => {
  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(copyData))
    alert(`Data copied in your clipboard`)
  }

  return (
    <div className="flex flex-col gap-3">
      <h4>{title}</h4>
      <div className="flex flex-col md:flex-row gap-3">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={submitDisabled}
          hideChevron
        >
          {submitText}
        </Button>
        <Button
          className="w-full rounded-lg"
          onClick={copy}
          disabled={copyDataDisabled}
          hideChevron
        >
          {copyText}
        </Button>
      </div>
    </div>
  )
}

export { SessionKeysEFOLayout }
