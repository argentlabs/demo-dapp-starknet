import { RpcProvider, constants, num } from "starknet"

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

export const RPC_HEADERS = {
  "argent-client": "demo-app",
} as const

export const STARKNET_NETWORKS = {
  mainnet: {
    chainId: constants.NetworkName.SN_MAIN,
    dummyContractAddress: ARGENT_DUMMY_CONTRACT_MAINNET_ADDRESS,
    rpcSpecVersion: constants.SupportedRpcVersion.v0_10_2,
    rpcUrl:
      process.env.NEXT_PUBLIC_MAINNET_RPC_URL ||
      "https://cloud.argent-api.com/v1/starknet/mainnet/rpc/v0.10",
    sessionServiceBaseUrl:
      process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_MAINNET_BASE_URL ||
      "https://cloud.argent-api.com/v1",
    starknetChainId: constants.StarknetChainId.SN_MAIN,
    xSessionsNetwork: "mainnet",
  },
  sepolia: {
    chainId: constants.NetworkName.SN_SEPOLIA,
    dummyContractAddress: ARGENT_DUMMY_CONTRACT_SEPOLIA_ADDRESS,
    rpcSpecVersion: constants.SupportedRpcVersion.v0_10_2,
    rpcUrl:
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
      "https://api.hydrogen.argent47.net/v1/starknet/sepolia/rpc/v0.10",
    sessionServiceBaseUrl:
      process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_SEPOLIA_BASE_URL ||
      process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL ||
      "https://api.hydrogen.argent47.net/v1",
    starknetChainId: constants.StarknetChainId.SN_SEPOLIA,
    xSessionsNetwork: "sepolia",
  },
} as const

export type NetworkConfig =
  (typeof STARKNET_NETWORKS)[keyof typeof STARKNET_NETWORKS]

export const DEFAULT_CHAIN_ID =
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID === constants.NetworkName.SN_MAIN ||
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.NetworkName.SN_MAIN
    : constants.NetworkName.SN_SEPOLIA

export const getNetworkConfig = (
  chainId?: bigint | number | string | null,
): NetworkConfig => {
  const hexChainId =
    typeof chainId === "bigint" || typeof chainId === "number"
      ? num.toHex(chainId)
      : chainId

  return hexChainId === constants.StarknetChainId.SN_MAIN ||
    hexChainId === constants.NetworkName.SN_MAIN
    ? STARKNET_NETWORKS.mainnet
    : STARKNET_NETWORKS.sepolia
}

export const getProvider = (chainId?: bigint | number | string | null) => {
  const network = getNetworkConfig(chainId)

  return new RpcProvider({
    specVersion: network.rpcSpecVersion,
    nodeUrl: network.rpcUrl,
    headers: RPC_HEADERS,
    chainId: network.starknetChainId,
  })
}

export const CHAIN_ID = DEFAULT_CHAIN_ID
export const IS_MAINNET = DEFAULT_CHAIN_ID === constants.NetworkName.SN_MAIN
export const provider = getProvider(DEFAULT_CHAIN_ID)
export const ARGENT_SESSION_SERVICE_BASE_URL =
  getNetworkConfig(DEFAULT_CHAIN_ID).sessionServiceBaseUrl
export const ARGENT_WEBWALLET_URL =
  process.env.NEXT_PUBLIC_ARGENT_WEBWALLET_URL ||
  "https://sepolia-web.argent.xyz"

export const USE_SEPOLIA_DUMMY_CONTRACT = process.env
  .NEXT_PUBLIC_USE_SEPOLIA_DUMMY_CONTRACT
  ? process.env.NEXT_PUBLIC_USE_SEPOLIA_DUMMY_CONTRACT === "true"
  : false

export const ARGENT_DUMMY_CONTRACT_ADDRESS =
  getNetworkConfig(DEFAULT_CHAIN_ID).dummyContractAddress

export const AVNU_PAYMASTER_API_KEY =
  process.env.NEXT_PUBLIC_AVNU_API_KEY || undefined
