import { ARGENT_SESSION_SERVICE_BASE_URL, CHAIN_ID } from "@/constants"
import { FC, useState } from "react"
import { constants } from "starknet"
import { WithSessionAccount } from "../types"
import { useMainnetContract } from "./useMainnetContract"
import { useTestnetContract } from "./useTestnetContract"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"

const SessionKeysExecute: FC<WithSessionAccount> = ({ sessionAccount }) => {
  const submitTestnetTransaction = useTestnetContract({ sessionAccount })
  const submitMainnetTransaction = useMainnetContract({ sessionAccount })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignSessionKeys = async () => {
    try {
      setIsSubmitting(true)
      const transaction_hash =
        CHAIN_ID === constants.NetworkName.SN_MAIN ||
        ARGENT_SESSION_SERVICE_BASE_URL.includes("staging")
          ? await submitMainnetTransaction?.()
          : await submitTestnetTransaction?.()

      setTimeout(() => {
        alert(`Transaction sent: ${transaction_hash}`)
      })

      setIsSubmitting(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h4>Execute session transaction</h4>
      <Button
        className="w-full"
        disabled={!sessionAccount || isSubmitting}
        onClick={handleSignSessionKeys}
        hideChevron
      >
        Submit session tx {isSubmitting ? <Spinner /> : ""}
      </Button>
    </>
  )
}

export { SessionKeysExecute }
