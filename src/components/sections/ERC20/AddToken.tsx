import { Button } from "@/components/ui/Button"
import { useAccount, useWalletRequest } from "@starknet-react/core"
import { SectionLayout } from "../SectionLayout"
import { AddTokenIcon } from "@/components/icons/AddTokenIcon"

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
    <SectionLayout sectionTitle="Add Token" icon={<AddTokenIcon />}>
      <div className="flex w-1/2 justify-start">
        <Button
          className="w-full"
          onClick={async () => {
            await walletRequest.requestAsync()
          }}
          hideChevron
        >
          Add Token
        </Button>
      </div>
    </SectionLayout>
  )
}

export { AddToken }
