import { constants, num } from "starknet"

const toHexChainid = (chainId?: bigint): string | null =>
  typeof chainId === "bigint" ? num.toHex(chainId ?? 0) : null
const isMainnet = (hexChainId: string | null) =>
  hexChainId === constants.StarknetChainId.SN_MAIN
const isTestnet = (hexChainId: string | null) =>
  hexChainId === constants.StarknetChainId.SN_SEPOLIA

export { toHexChainid, isMainnet, isTestnet }
