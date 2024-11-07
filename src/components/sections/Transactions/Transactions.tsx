import { Flex } from "@/components/ui/Flex"
import { useAccount } from "@starknet-react/core"
import { useState } from "react"
import { Accordion } from "../../ui/Accordion"
import { Button } from "../../ui/Button"
import { SendERC20 } from "../Transactions/SendERC20"
import { SendMulticall } from "../Transactions/SendMulticall"

const Transactions = () => {
  const [showErc20, setShowErc20] = useState(false)
  const { account, address } = useAccount()

  if (!account || !address) {
    return null
  }

  return (
    <>
      <Accordion
        items={[
          {
            title: "Transactions",
            content: (
              <>
                <Flex flexDirection="column" gap="12px">
                  <Button
                    className="full"
                    onClick={() => {
                      setShowErc20((prev) => !prev)
                    }}
                  >
                    Send ERC20
                  </Button>
                  {showErc20 && <SendERC20 />}
                  <SendMulticall />
                </Flex>
              </>
            ),
          },
        ]}
      />
    </>
  )
}

export { Transactions }
