import { Accordion } from "@/components/ui/Accordion"
import { Button } from "@/components/ui/Button"
import { Flex } from "@/components/ui/Flex"
import { useAccount, useWalletRequest } from "@starknet-react/core"

const AddToken = () => {
  const { account, address } = useAccount()

  const walletRequest = useWalletRequest({
    type: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address:
          "0x62376175ba2ddc307b30813312d8f09796f777b8c24dd327a5cdd65c3539fba",
        decimals: 18,
        name: "snjs6-celebration",
        symbol: "snsj6",
      },
    },
  })

  if (!account || !address) {
    return null
  }

  return (
    <Accordion
      items={[
        {
          title: "Add Token",
          content: (
            <Flex
              color="black"
              borderWidth="0px"
              borderRadius="8px"
              justifyContent="flex-start"
              width="50%"
            >
              <Button
                className="full"
                onClick={async () => {
                  await walletRequest.requestAsync()
                }}
              >
                Add Token
              </Button>
            </Flex>
          ),
        },
      ]}
    />
  )
}

export { AddToken }
