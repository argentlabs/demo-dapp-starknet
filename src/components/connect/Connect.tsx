import { useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import Image from "next/image"
import { useEffect, useState } from "react"
import { SectionLayout } from "../sections/SectionLayout"
import { Button } from "../ui/Button"
import { ConnectorButton } from "./ConnectorButton"
import { ConnectStarknetkitModal } from "./ConnectStarknetkitModal"
import { DisconnectIcon } from "../icons/DisconnectIcon"

const Connect = () => {
  const { isConnected } = useAccount()
  const { connectors } = useConnect()
  const { disconnect } = useDisconnect({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <></>
  }

  return (
    <SectionLayout sectionTitle="Connection">
      <div className="flex column gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <ConnectStarknetkitModal />
          <Button
            className={`w-full ${!isConnected ? "disabled" : ""} justify-center`}
            onClick={() => disconnect()}
            disabled={!isConnected}
            hideChevron
            leftIcon={<DisconnectIcon />}
          >
            Disconnect
          </Button>
        </div>
        <div className="flex column w-full p-3 border border-solid border-raisin-black gap-5 rounded-xl">
          <span className="text-base font-medium leading-6 text-left">
            Starknet-react connectors
          </span>
          <div className="grid grid-cols-connectors-grid gap-4">
            {connectors.map((connector) => {
              const icon =
                typeof connector.icon === "string"
                  ? connector.icon
                  : connector.icon.dark
              const isSvg = icon?.startsWith("<svg")
              return (
                <ConnectorButton
                  key={connector.id}
                  connector={connector}
                  icon={
                    <>
                      {isSvg ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: icon }}
                          className="connector-icon"
                        />
                      ) : (
                        <Image
                          alt={connector.name}
                          src={icon}
                          height={17}
                          width={17}
                        />
                      )}
                    </>
                  }
                />
              )
            })}
          </div>
        </div>
      </div>
    </SectionLayout>
  )
}

export { Connect }
