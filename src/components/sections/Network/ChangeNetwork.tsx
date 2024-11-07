import { Button } from "@/components/ui/Button"
import { Flex } from "@/components/ui/Flex"
import { useWalletRequest } from "@starknet-react/core"
import { constants } from "starknet"

const ChangeNetwork = () => {
  const walletRequest = useWalletRequest({
    type: "wallet_switchStarknetChain",
    params: {
      chainId: constants.StarknetChainId.SN_MAIN,
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
        Change Network
      </Button>
    </Flex>
  )
}

export { ChangeNetwork }
