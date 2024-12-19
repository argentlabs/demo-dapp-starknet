import {
  ARGENT_DUMMY_CONTRACT_ADDRESS,
  ARGENT_SESSION_SERVICE_BASE_URL,
  CHAIN_ID,
  ETHTokenAddress,
} from "@/constants"
import { SessionKey } from "@argent/x-sessions"
import { constants, ec } from "starknet"
import { parseUnits } from "./token"

/* Hardcoded values for session example */
const ETHFees = [
  {
    tokenAddress: ETHTokenAddress,
    maxAmount: parseUnits("0.1", 18).value.toString(),
  },
]

const STRKFees = [
  {
    tokenAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    maxAmount: "10000000000000000",
  },
  {
    tokenAddress:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    maxAmount: "200000000000000000000",
  },
]

const allowedMethods =
  CHAIN_ID === constants.NetworkName.SN_MAIN ||
  ARGENT_SESSION_SERVICE_BASE_URL.includes("staging")
    ? [
        {
          "Contract Address": ARGENT_DUMMY_CONTRACT_ADDRESS,
          selector: "set_number",
        },
      ]
    : [
        {
          "Contract Address": ETHTokenAddress,
          selector: "transfer",
        },
      ]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expiry = Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000) as any

const metaData = (isStarkFeeToken: boolean) => ({
  projectID: "test-dapp",
  txFees: isStarkFeeToken ? STRKFees : ETHFees,
})

const privateKey = ec.starkCurve.utils.randomPrivateKey()

const sessionKey: SessionKey = {
  privateKey,
  publicKey: ec.starkCurve.getStarkKey(privateKey),
}

export { allowedMethods, sessionKey, expiry, metaData }
