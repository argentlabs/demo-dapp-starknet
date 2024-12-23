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

  const handleChangeNetwork = async () => {
    try {
      await walletRequest.requestAsync()
    } catch {
      alert("Not implemented")
    }
  }

  return (
    <div className="flex w-full justify-start">
      <Button className="w-full" onClick={handleChangeNetwork} hideChevron>
        Change Network
      </Button>
    </div>
  )
}

export { ChangeNetwork }
