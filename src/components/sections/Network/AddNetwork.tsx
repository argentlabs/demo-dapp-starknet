import { Button } from "@/components/ui/Button"
import { Flex } from "@/components/ui/Flex"
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
    <Flex
      color="black"
      borderWidth="0px"
      borderRadius="8px"
      justifyContent="flex-start"
      width="100%"
    >
      <Button
        className="full"
        onClick={async () => {
          await walletRequest.requestAsync()
        }}
      >
        Add Network
      </Button>
    </Flex>
  )
}

export { AddNetwork }
