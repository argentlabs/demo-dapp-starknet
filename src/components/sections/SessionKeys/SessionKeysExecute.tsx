import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { useAccount } from "@starknet-react/core"
import { FC, useState } from "react"
import { CallData } from "starknet"
import { WithSessionAccount } from "./types"

const SessionKeysExecute: FC<WithSessionAccount> = ({
  network,
  sessionAccount,
}) => {
  const { address } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSessionExecute = async () => {
    if (!address) {
      throw new Error("No address")
    }

    if (!sessionAccount) {
      throw new Error("No session account")
    }

    try {
      setIsSubmitting(true)

      // https://www.starknetjs.com/docs/guides/estimate_fees/#estimateinvokefee
      const { resourceBounds } = await sessionAccount.estimateInvokeFee({
        contractAddress: network.dummyContractAddress,
        entrypoint: "set_number",
        calldata: CallData.compile(["1"]),
      })

      const { transaction_hash } = await sessionAccount.execute(
        {
          contractAddress: network.dummyContractAddress,
          entrypoint: "set_number",
          calldata: CallData.compile(["1"]),
        },
        {
          resourceBounds,
        },
      )

      setTimeout(() => {
        alert(`Transaction sent: ${transaction_hash}`)
      })

      setIsSubmitting(true)
    } catch (err) {
      console.error(err)
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
        onClick={handleSessionExecute}
        hideChevron
      >
        Submit session tx {isSubmitting ? <Spinner /> : ""}
      </Button>
    </>
  )
}

export { SessionKeysExecute }
