import {
  ARGENT_DUMMY_CONTRACT_ADDRESS,
  ARGENT_SESSION_SERVICE_BASE_URL,
  CHAIN_ID,
} from "@/constants"
import { sessionKey } from "@/helpers/sessionKeys"
import { createOutsideExecutionTypedData } from "@argent/x-sessions"
import { FC, useState } from "react"
import { CallData, constants } from "starknet"
import { SessionKeysEFOLayout } from "./SessionKeysEFOLayout"
import { WithSession } from "./types"

const SessionKeysTypedDataOutside: FC<WithSession> = ({
  session,
  sessionAccount,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outsideTypedData, setOutsideTypedData] = useState<any | undefined>()

  const handleSubmitEFO = async () => {
    try {
      if (!session || !sessionAccount) {
        throw new Error("No open session")
      }

      const efoTypedData = await createOutsideExecutionTypedData({
        session,
        sessionKey,
        calls: [
          {
            contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
            entrypoint: "set_number",
            calldata: CallData.compile(["1"]),
          },
        ],
        argentSessionServiceUrl: ARGENT_SESSION_SERVICE_BASE_URL,
        network:
          CHAIN_ID === constants.NetworkName.SN_SEPOLIA ? "sepolia" : "mainnet",
      })

      console.log(
        "execute from outside typed data response",
        JSON.stringify(efoTypedData),
      )

      setOutsideTypedData(efoTypedData)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SessionKeysEFOLayout
      copyData={JSON.stringify(outsideTypedData)}
      copyDataDisabled={!sessionAccount || !outsideTypedData}
      handleSubmit={handleSubmitEFO}
      submitDisabled={!sessionAccount}
      title="Create outside typed data"
      submitText="Submit EFO TypedData"
      copyText="Copy EFO TypedData"
    />
  )
}

export { SessionKeysTypedDataOutside }
