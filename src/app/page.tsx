"use client"

import { StarknetDapp } from "@/components/StarknetDapp"
import { connectors } from "@/connectors"
import { RPC_HEADERS, getNetworkConfig } from "@/constants"
import { mainnet, sepolia } from "@starknet-react/chains"
import {
  jsonRpcProvider,
  /* publicProvider, */
  StarknetConfig,
} from "@starknet-react/core"

export default function Home() {
  const chains = [mainnet, sepolia]
  /* const providers = publicProvider() */

  const provider = jsonRpcProvider({
    rpc: (chain) => {
      const network = getNetworkConfig(chain.id)

      return {
        nodeUrl: network.rpcUrl,
        specVersion: network.rpcSpecVersion,
        headers: RPC_HEADERS,
      }
    },
  })

  return (
    <div className="flex flex-col flex-grow">
      <StarknetConfig
        chains={chains}
        provider={provider}
        connectors={connectors}
      >
        <StarknetDapp />
      </StarknetConfig>
    </div>
  )
}
