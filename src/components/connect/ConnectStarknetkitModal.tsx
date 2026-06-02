import { isUserRejectedRequest } from "@/helpers/isUserRejectedRequest"
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
        try {
          const { connector } = await starknetkitConnectModal()
          if (!connector) {
            return
          }
          await connectAsync({ connector })
        } catch (error) {
          if (isUserRejectedRequest(error)) {
            return
          }
          throw error
        }
      }}
      hideChevron
    >
      Starknetkit Modal
    </Button>
  )
}

export { ConnectStarknetkitModal }
