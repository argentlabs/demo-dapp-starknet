import { useConnect } from "@starknet-react/core"
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit"
import { Button } from "../ui/Button"

const ConnectStarknetkitModal = () => {
  const { connectAsync, connectors } = useConnect()

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: "dark",
  })

  return (
    <Button
      className="w-full justify-center"
      onClick={async () => {
        const { connector } = await starknetkitConnectModal()
        if (!connector) {
          // or throw error
          return
        }
        await connectAsync({ connector })
      }}
      hideChevron
    >
      Starknetkit Modal
    </Button>
  )
}

export { ConnectStarknetkitModal }
