import { Address } from "@starknet-react/core"
import { getChecksumAddress } from "starknet"

export const normalizeAddress = (address: string) =>
  getChecksumAddress(address) as Address

export const formatTruncatedAddress = (address: string) => {
  const normalized = normalizeAddress(address)
  const hex = normalized.slice(0, 2)
  const start = normalized.slice(2, 6)
  const end = normalized.slice(-4)
  return `${hex}${start}…${end}`
}
