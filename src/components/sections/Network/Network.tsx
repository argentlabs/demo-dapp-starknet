import { Flex } from "@/components/ui/Flex"
import { AddNetwork } from "./AddNetwork"
import { ChangeNetwork } from "./ChangeNetwork"
import { Accordion } from "@/components/ui/Accordion"
import { useAccount } from "@starknet-react/core"

const Network = () => {
  const { account, address } = useAccount()

  if (!account || !address) {
    return null
  }

  return (
    <Accordion
      items={[
        {
          title: "Network",
          content: (
            <Flex flex={1} width="100%" gap="12px">
              <AddNetwork />
              <ChangeNetwork />
            </Flex>
          ),
        },
      ]}
    />
  )
}

export { Network }
