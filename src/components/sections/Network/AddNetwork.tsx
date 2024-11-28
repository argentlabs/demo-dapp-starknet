import { Button } from "@/components/ui/Button"
import { ETHTokenAddress } from "@/constants"
import { useWalletRequest } from "@starknet-react/core"
import { shortString } from "starknet"

const AddNetwork = () => {
  const walletRequest = useWalletRequest({
    type: "wallet_addStarknetChain",
    params: {
      id: "ZORG",
      chain_id: shortString.encodeShortString("ZORG"), // A 0x-prefixed hexadecimal string
      chain_name: "ZORG",
      rpc_urls: ["http://192.168.1.44:6060"],
      native_currency: {
        type: "ERC20",
        options: {
          address: ETHTokenAddress, // Not part of the standard, but required by StarkNet as it can work with any ERC20 token as the fee token
          name: "ETHEREUM",
          symbol: "ETH", // 2-6 characters long
          decimals: 18,
        },
      },
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
        Add Network
      </Button>
    </div>
  )
}

export { AddNetwork }
