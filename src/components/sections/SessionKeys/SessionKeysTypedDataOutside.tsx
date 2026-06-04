import { sessionKey } from "@/helpers/sessionKeys"
import { createOutsideExecutionTypedData } from "@argent/x-sessions"
import { FC, useState } from "react"
import { CallData } from "starknet"
import { SessionKeysEFOLayout } from "./SessionKeysEFOLayout"
import { WithSession } from "./types"

const SessionKeysTypedDataOutside: FC<WithSession> = ({
  network,
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
            contractAddress: network.dummyContractAddress,
            entrypoint: "set_number",
            calldata: CallData.compile(["1"]),
          },
        ],
        argentSessionServiceUrl: network.sessionServiceBaseUrl,
        network: network.xSessionsNetwork,
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
