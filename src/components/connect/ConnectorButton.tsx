import { isUserRejectedRequest } from "@/helpers/isUserRejectedRequest"
import { Connector, useConnect } from "@starknet-react/core"
import { FC, ReactNode } from "react"
import { Button } from "../ui/Button"

const ConnectorButton: FC<{ connector: Connector; icon: ReactNode }> = ({
  connector,
  icon,
}) => {
  const { connectAsync } = useConnect()
  if (!connector.available()) {
    return null
  }

  return (
    <Button
      key={connector.id}
      onClick={async () => {
        try {
          await connectAsync({ connector })
        } catch (error) {
          if (isUserRejectedRequest(error)) {
            return
          }
          throw error
        }
      }}
      className="bg-raisin-black h-10 text-sm leading-4 font-medium gap-2 justify-center hover:#262933"
      hideChevron
    >
      <div className="flex items-center gap-2">
        {icon}
        {connector.name}
      </div>
    </Button>
  )
}

export { ConnectorButton }
