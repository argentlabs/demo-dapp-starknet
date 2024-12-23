import { num, uint256 } from "starknet"

export interface BigDecimal {
  value: bigint
  decimals: number
}

export const parseUnits = (value: string, decimals: number): BigDecimal => {
  let [integer, fraction = ""] = value.split(".")

  const negative = integer.startsWith("-")
  if (negative) {
    integer = integer.slice(1)
  }

  // If the fraction is longer than allowed, round it off
  if (fraction.length > decimals) {
    const unitIndex = decimals
    const unit = Number(fraction[unitIndex])

    if (unit >= 5) {
      const fractionBigInt = BigInt(fraction.slice(0, decimals)) + BigInt(1)
      fraction = fractionBigInt.toString().padStart(decimals, "0")
    } else {
      fraction = fraction.slice(0, decimals)
    }
  } else {
    fraction = fraction.padEnd(decimals, "0")
  }

  const parsedValue = BigInt(`${negative ? "-" : ""}${integer}${fraction}`)

  return {
    value: parsedValue,
    decimals,
  }
}

export const getUint256CalldataFromBN = (bn: num.BigNumberish) =>
  uint256.bnToUint256(bn)

export const parseInputAmountToUint256 = (
  input: string,
  decimals: number = 18,
) => getUint256CalldataFromBN(parseUnits(input, decimals).value)
