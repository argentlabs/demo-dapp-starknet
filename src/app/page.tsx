"use client"

import { StarknetDapp } from "@/components/StarknetDapp"
import { connectors } from "@/connectors"
import { mainnet, sepolia } from "@starknet-react/chains"
import { publicProvider, StarknetConfig } from "@starknet-react/core"
import { clusterApiUrl } from "@solana/web3.js"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  CloverWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
  SalmonWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  HuobiWalletAdapter,
  CoinbaseWalletAdapter,
  NekoWalletAdapter,
  TrustWalletAdapter,
  NightlyWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { useMemo } from "react"
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("@solana/wallet-adapter-react-ui/styles.css")

export default function Home() {
  const chains = [mainnet, sepolia]
  const providers = publicProvider()
  const solNetwork = WalletAdapterNetwork.Mainnet
  const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork])
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new CloverWalletAdapter(),
      new SolongWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SalmonWalletAdapter(),
      new MathWalletAdapter(),
      new Coin98WalletAdapter(),
      new HuobiWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new NekoWalletAdapter(),
      new TrustWalletAdapter(),
      new NightlyWalletAdapter(),
    ],
    [],
  )

  return (
    <div className="flex flex-col h-screen">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <StarknetConfig
              chains={chains}
              provider={providers}
              connectors={connectors}
            >
              <StarknetDapp />
            </StarknetConfig>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}
