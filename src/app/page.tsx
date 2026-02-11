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
    rpc: () => ({
      nodeUrl: "https://rpc.starknet.lava.build",
    }),
  })

  const sepoliaJsonRpcProvider = jsonRpcProvider({
    rpc: () => ({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_PROVIDER_URL,
    }),
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
