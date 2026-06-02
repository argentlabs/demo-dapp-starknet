import { isUserRejectedRequest } from "@/helpers/isUserRejectedRequest"
import { useConnect } from "@starknet-react/core"
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit"

const HeaderConnectButton = () => {
  const { connectAsync, connectors } = useConnect()

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: "dark",
  })

  return (
    <>
      <button
        className="px-x md:px-12 bg-gradient-to-r from-nebula-from to-nebula-to text-white rounded-lg"
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
      >
        Connect wallet
      </button>
    </>
  )
}

export { HeaderConnectButton }
