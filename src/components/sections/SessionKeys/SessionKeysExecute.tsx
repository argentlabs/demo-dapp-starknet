import { dummyContractAbi } from "@/abi/dummyContractAbi"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { ARGENT_DUMMY_CONTRACT_ADDRESS } from "@/constants"
import { useAccount, useContract } from "@starknet-react/core"
import { FC, useState } from "react"
import { WithSessionAccount } from "./types"
import { CallData } from "starknet"

const SessionKeysExecute: FC<WithSessionAccount> = ({ sessionAccount }) => {
  const { address } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { contract } = useContract({
    abi: dummyContractAbi,
    address: ARGENT_DUMMY_CONTRACT_ADDRESS,
    provider: sessionAccount,
  })

  const handleSessionExecute = async () => {
    try {
      setIsSubmitting(true)

      if (!address) {
        throw new Error("No address")
      }

      if (!sessionAccount) {
        throw new Error("No session account")
      }

      if (!contract) {
        throw new Error("No contract")
      }

      // https://www.starknetjs.com/docs/guides/estimate_fees/#estimateinvokefee
      const { suggestedMaxFee, resourceBounds: estimatedResourceBounds } =
        await sessionAccount.estimateInvokeFee(
          {
            contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
            entrypoint: "set_number",
            calldata: CallData.compile(["1"]),
          },
          {
            version: "0x3",
          },
        )

      const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)

      const resourceBounds = {
        ...estimatedResourceBounds,
        l1_gas: {
          ...estimatedResourceBounds.l1_gas,
          max_amount: "0x28",
        },
      }

      const { transaction_hash } = await sessionAccount.execute(
        {
          contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
          entrypoint: "set_number",
          calldata: CallData.compile(["1"]),
        },
        {
          maxFee,
          resourceBounds,
          version: "0x3",
        },
      )

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
        onClick={handleSessionExecute}
        hideChevron
      >
        Submit session tx {isSubmitting ? <Spinner /> : ""}
      </Button>
    </>
  )
}

export { SessionKeysExecute }
