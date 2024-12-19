import { dummyContractAbi } from "@/abi/dummyContractAbi"
import {
  ARGENT_DUMMY_CONTRACT_ADDRESS,
  ARGENT_SESSION_SERVICE_BASE_URL,
  CHAIN_ID,
} from "@/constants"
import { sessionKey } from "@/helpers/sessionKeys"
import { createOutsideExecutionTypedData } from "@argent/x-sessions"
import { useContract } from "@starknet-react/core"
import { constants } from "starknet"
import { WithSession } from "../types"

const useMainnetContract = ({ session, sessionAccount }: WithSession) => {
  const { contract: mainnetContract } = useContract({
    abi: dummyContractAbi,
    address: ARGENT_DUMMY_CONTRACT_ADDRESS,
    provider: sessionAccount,
  })

  const submitMainnetEFO = async () => {
    try {
      if (!session || !sessionAccount) {
        throw new Error("No open session")
      }
      // https://www.starknetjs.com/docs/guides/use_erc20/#interact-with-an-erc20
      // check .populate
      const transferCallData = mainnetContract.populate("set_number", {
        number: 1,
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

  return CHAIN_ID === constants.NetworkName.SN_MAIN ? submitMainnetEFO : null
}

export { useMainnetContract }
