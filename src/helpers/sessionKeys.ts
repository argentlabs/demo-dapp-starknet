import {
  ARGENT_DUMMY_CONTRACT_ADDRESS,
  ETHTokenAddress,
  STRKTokenAddress,
} from "@/constants"
import { bytesToHexString, SessionKey } from "@argent/x-sessions"
import { ec } from "starknet"
import { parseUnits } from "./token"

const allowedMethods = [
  {
    "Contract Address": ARGENT_DUMMY_CONTRACT_ADDRESS,
    selector: "set_number",
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expiry = Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000) as any

const metaData = {
  projectID: "test-dapp",
  txFees: [
    {
      tokenAddress: ETHTokenAddress,
      maxAmount: parseUnits("0.1", 18).value.toString(),
    },
    {
      tokenAddress: STRKTokenAddress,
      maxAmount: parseUnits("20", 18).value.toString(),
    },
  ],
}

const privateKey = ec.starkCurve.utils.randomPrivateKey()

const sessionKey: SessionKey = {
  privateKey: bytesToHexString(privateKey),
  publicKey: ec.starkCurve.getStarkKey(privateKey),
}

export { allowedMethods, expiry, metaData, sessionKey }
