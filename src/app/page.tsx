"use client"

import { StarknetDapp } from "@/components/StarknetDapp"
import { connectors } from "@/connectors"
import { IS_MAINNET } from "@/constants"
import { mainnet, sepolia } from "@starknet-react/chains"
import {
  jsonRpcProvider,
  /* publicProvider, */
  StarknetConfig,
} from "@starknet-react/core"

export default function Home() {
  const chains = [mainnet, sepolia]
  /* const providers = publicProvider() */

  const mainnetJsonRpcProvider = jsonRpcProvider({
    rpc: (chain) => {
      console.log("mainnet", chain)
      return {
        nodeUrl: "https://rpc.starknet.lava.build",
      }
    },
  })

  const sepoliaJsonRpcProvider = jsonRpcProvider({
    rpc: (chain) => {
      console.log("sepolia", chain)
      return {
        nodeUrl: "https://rpc.starknet-sepolia.lava.build",
      }
    },
  })

  return (
    <div className="flex flex-col flex-grow">
      <StarknetConfig
        chains={chains}
        provider={IS_MAINNET ? mainnetJsonRpcProvider : sepoliaJsonRpcProvider}
        connectors={connectors}
      >
        <StarknetDapp />
      </StarknetConfig>
    </div>
  )
}
