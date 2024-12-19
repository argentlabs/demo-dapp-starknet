import { erco20TransferAbi } from "@/abi/erc20TransferAbi"
import {
  ARGENT_SESSION_SERVICE_BASE_URL,
  CHAIN_ID,
  ETHTokenAddress,
} from "@/constants"
import { sessionKey } from "@/helpers/sessionKeys"
import { parseInputAmountToUint256 } from "@/helpers/token"
import { createOutsideExecutionTypedData } from "@argent/x-sessions"
import { useAccount, useContract } from "@starknet-react/core"
import { constants } from "starknet"
import { WithSession } from "../types"

const useTestnetContract = ({ session, sessionAccount }: WithSession) => {
  const { address } = useAccount()
  const { contract: testnetContract } = useContract({
    abi: erco20TransferAbi,
    address: ETHTokenAddress,
    provider: sessionAccount,
  })

  const submitTestnetEFO = async () => {
    try {
      if (!address) {
        throw new Error("No address")
      }

      if (!session || !sessionAccount) {
        throw new Error("No open session")
      }

      // https://www.starknetjs.com/docs/guides/use_erc20/#interact-with-an-erc20
      // check .populate
      const transferCallData = testnetContract.populate("transfer", {
        recipient: address.toString(),
        amount: parseInputAmountToUint256("0.000000001"),
      })

      const efoTypedData = await createOutsideExecutionTypedData({
        session,
        sessionKey,
        calls: [transferCallData],
        argentSessionServiceUrl: ARGENT_SESSION_SERVICE_BASE_URL,
      })

      console.log(
        "execute from outside typed data response",
        JSON.stringify(efoTypedData),
      )

      return efoTypedData
    } catch (e) {
      console.error(e)
    }
  }

  return CHAIN_ID === constants.NetworkName.SN_SEPOLIA ? submitTestnetEFO : null
}

export { useTestnetContract }
