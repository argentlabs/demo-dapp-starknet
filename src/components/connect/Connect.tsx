import { useAccount, useConnect } from "@starknet-react/core"
import { useEffect, useState } from "react"
import { disconnect } from "starknetkit"
import { Accordion } from "../ui/Accordion"
import { Button } from "../ui/Button"
import { Flex } from "../ui/Flex"
import { ConnectorButton } from "./ConnectorButton"
import { ConnectStarknetkitModal } from "./ConnectStarknetkitModal"

const Connect = () => {
  const { isConnected } = useAccount()
  const { connectors } = useConnect()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <></>
  }

  return (
    <Flex flexDirection="column" gap="12px">
      <Accordion
        isDefaultOpen
        items={[
          {
            title: "Connection",
            content: (
              <Flex gap="12px">
                <Flex flex={1} flexDirection="column" gap="12px">
                  <ConnectStarknetkitModal />

                  <Accordion
                    withBorder
                    items={[
                      {
                        title: "starknet-react connectors",
                        content: (
                          <Flex
                            flex={1}
                            flexDirection="column"
                            gap="12px"
                            padding="8px"
                          >
                            {connectors.map((connector) => (
                              <ConnectorButton
                                key={connector.id}
                                connector={connector}
                              />
                            ))}
                          </Flex>
                        ),
                      },
                    ]}
                  />
                </Flex>

                <Flex flex={1} height="fit-content">
                  <Button
                    className="full"
                    onClick={() => disconnect()}
                    disabled={!isConnected}
                  >
                    Disconnect
                  </Button>
                </Flex>
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  )
}

export { Connect }
