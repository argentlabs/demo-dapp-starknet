import { dummyContractAbi } from "@/abi/dummyContractAbi"
import {
  ARGENT_DUMMY_CONTRACT_ADDRESS,
  ARGENT_SESSION_SERVICE_BASE_URL,
  CHAIN_ID,
} from "@/constants"
import { sessionKey } from "@/helpers/sessionKeys"
import { createOutsideExecutionCall } from "@argent/x-sessions"
import { useContract } from "@starknet-react/core"
import { FC, useState } from "react"
import { constants } from "starknet"
import { SessionKeysEFOLayout } from "./SessionKeysEFOLayout"
import { WithSession } from "./types"

const SessionKeysExecuteOutside: FC<WithSession> = ({
  session,
  sessionAccount,
}) => {
  const { contract } = useContract({
    abi: dummyContractAbi,
    address: ARGENT_DUMMY_CONTRACT_ADDRESS,
    provider: sessionAccount,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outsideExecution, setOutsideExecution] = useState<any | undefined>()

  const handleSubmitEFO = async () => {
    try {
      if (!session || !sessionAccount) {
        throw new Error("No open session")
      }
      // https://www.starknetjs.com/docs/guides/use_erc20/#interact-with-an-erc20
      // check .populate
      const transferCallData = contract.populate("set_number", {
        number: 1,
      })

      const efoExecutionCall = await createOutsideExecutionCall({
        session,
        sessionKey,
        calls: [transferCallData],
        argentSessionServiceUrl: ARGENT_SESSION_SERVICE_BASE_URL,
        network:
          CHAIN_ID === constants.NetworkName.SN_SEPOLIA ? "sepolia" : "mainnet",
      })

      console.log(
        "execute from outside response",
        JSON.stringify(efoExecutionCall),
      )

      setOutsideExecution(efoExecutionCall)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SessionKeysEFOLayout
      copyData={JSON.stringify(outsideExecution)}
      copyDataDisabled={!sessionAccount || !outsideExecution}
      handleSubmit={handleSubmitEFO}
      submitDisabled={!sessionAccount}
      title="Create outside execution call"
      submitText="Submit EFO call"
      copyText="Copy EFO call"
    />
  )
}

export { SessionKeysExecuteOutside }
