import { Connector, useConnect } from "@starknet-react/core"
import { FC } from "react"
import { Button } from "../ui/Button"

const ConnectorButton: FC<{ connector: Connector }> = ({ connector }) => {
  const { connectAsync } = useConnect()
  if (!connector.available()) {
    return null
  }

  return (
    <Button
      className="full"
      key={connector.id}
      onClick={async () => {
        await connectAsync({ connector })
      }}
    >
      {connector.name}
    </Button>
  )
}

export { ConnectorButton }
