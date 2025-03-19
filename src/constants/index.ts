import { RpcProvider, constants } from "starknet"

export const ETHTokenAddress =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"

export const STRKTokenAddress =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"

export const DAITokenAddress =
  "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3"

export const ARGENT_DUMMY_CONTRACT_MAINNET_ADDRESS =
  "0x001c515f991f706039696a54f6f33730e9b0e8cc5d04187b13c2c714401acfd4"

export const ARGENT_DUMMY_CONTRACT_SEPOLIA_ADDRESS =
  "0x88d3cc4377a6cdfd27545a11548bd070c4e2e1e3df3d402922dbc4350b416"

export const CHAIN_ID =
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.NetworkName.SN_MAIN
    : constants.NetworkName.SN_SEPOLIA

const NODE_URL =
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? "https://starknet-mainnet.public.blastapi.io"
    : "https://starknet-sepolia.public.blastapi.io/rpc/v0_7"

const STARKNET_CHAIN_ID =
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA

export const provider = new RpcProvider({
  nodeUrl: NODE_URL,
  chainId: STARKNET_CHAIN_ID,
})

export const ARGENT_SESSION_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL ||
  "https://cloud.argent-api.com/v1"

export const ARGENT_WEBWALLET_URL =
  process.env.NEXT_PUBLIC_ARGENT_WEBWALLET_URL ||
  "https://sepolia-web.argent.xyz"

export const USE_SEPOLIA_DUMMY_CONTRACT = process.env
  .NEXT_PUBLIC_USE_SEPOLIA_DUMMY_CONTRACT
  ? process.env.NEXT_PUBLIC_USE_SEPOLIA_DUMMY_CONTRACT === "true"
  : false

export const ARGENT_DUMMY_CONTRACT_ADDRESS =
  CHAIN_ID === constants.NetworkName.SN_SEPOLIA
    ? ARGENT_DUMMY_CONTRACT_SEPOLIA_ADDRESS
    : ARGENT_DUMMY_CONTRACT_MAINNET_ADDRESS
