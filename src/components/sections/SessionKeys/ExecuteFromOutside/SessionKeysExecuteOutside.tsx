import { ARGENT_SESSION_SERVICE_BASE_URL, CHAIN_ID } from "@/constants"
import { FC, useState } from "react"
import { constants } from "starknet"
import { SessionKeysEFOLayout } from "../SessionKeysEFOLayout"
import { WithSession } from "../types"
import { useMainnetContract } from "./useMainnetContract"
import { useTestnetContract } from "./useTestnetContract"

const SessionKeysExecuteOutside: FC<WithSession> = ({
  session,
  sessionAccount,
}) => {
  const submitTestnetEFO = useTestnetContract({
    session,
    sessionAccount,
  })
  const submitMainnetEFO = useMainnetContract({
    session,
    sessionAccount,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outsideExecution, setOutsideExecution] = useState<any | undefined>()

  const handleSubmitEFO = async () => {
    try {
      const efoExecute =
        CHAIN_ID === constants.NetworkName.SN_MAIN ||
        ARGENT_SESSION_SERVICE_BASE_URL.includes("staging")
          ? await submitMainnetEFO?.()
          : await submitTestnetEFO?.()

      setOutsideExecution(efoExecute)
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
