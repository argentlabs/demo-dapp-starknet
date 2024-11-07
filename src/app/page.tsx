"use client"

import { StarknetDapp } from "@/components/StarknetDapp"
import { Flex } from "@/components/ui/Flex"
import { connectors } from "@/connectors"
import { CHAIN_ID } from "@/constants"
import { mainnet, sepolia } from "@starknet-react/chains"
import { publicProvider, StarknetConfig } from "@starknet-react/core"
import { constants } from "starknet"

/* TODO: update ui */

export default function Home() {
  const chains = [
    CHAIN_ID === constants.NetworkName.SN_MAIN ? mainnet : sepolia,
  ]
  const providers = publicProvider()

  return (
    <Flex flexDirection="column" className="demo-dapp-container">
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <StarknetConfig
        chains={chains}
        provider={providers}
        /* TODO: wait for starknet-react to update Connector interface */
        connectors={connectors as any}
      >
        <StarknetDapp />
      </StarknetConfig>
      {/* eslint-enable @typescript-eslint/no-explicit-any */}
    </Flex>
  )
}
