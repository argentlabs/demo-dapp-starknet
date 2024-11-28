import { Button } from "@/components/ui/Button"
import { isMainnet, toHexChainid } from "@/helpers/chainId"
import { useAccount, useWalletRequest } from "@starknet-react/core"
import { constants } from "starknet"

const ChangeNetwork = () => {
  const { chainId } = useAccount()

  const walletRequest = useWalletRequest({
    type: "wallet_switchStarknetChain",
    params: {
      chainId: isMainnet(toHexChainid(chainId))
        ? constants.StarknetChainId.SN_SEPOLIA
        : constants.StarknetChainId.SN_MAIN,
    },
  })

  return (
    <div className="flex w-full justify-start">
      <Button
        className="w-full"
        onClick={async () => {
          await walletRequest.requestAsync()
        }}
        hideChevron
      >
        Change Network
      </Button>
    </div>
  )
}

export { ChangeNetwork }
