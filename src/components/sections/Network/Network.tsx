import { useAccount } from "@starknet-react/core"
import { SectionLayout } from "../SectionLayout"
import { AddNetwork } from "./AddNetwork"
import { ChangeNetwork } from "./ChangeNetwork"
import { NetworkIcon } from "@/components/icons/NetworkIcon"

const Network = () => {
  const { account, address } = useAccount()

  if (!account || !address) {
    return null
  }

  return (
    <SectionLayout sectionTitle="Network" icon={<NetworkIcon />}>
      <div className="flex flex-1 w-full gap-3">
        <AddNetwork />
        <ChangeNetwork />
      </div>
    </SectionLayout>
  )
}

export { Network }
