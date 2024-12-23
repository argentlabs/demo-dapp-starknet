import { dummyContractAbi } from "@/abi/dummyContractAbi"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { ARGENT_DUMMY_CONTRACT_ADDRESS } from "@/constants"
import { useAccount, useContract } from "@starknet-react/core"
import { FC, useState } from "react"
import { WithSessionAccount } from "./types"

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

      const transferCallData = contract.populate("set_number", {
        number: 1,
      })

      // https://www.starknetjs.com/docs/guides/estimate_fees/#estimateinvokefee
      const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
        contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
        entrypoint: "set_number",
        calldata: transferCallData.calldata,
      })

      // https://www.starknetjs.com/docs/guides/estimate_fees/#fee-limitation
      const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)
      // send to same account
      const { transaction_hash } = await contract.set_number(
        transferCallData.calldata,
        {
          maxFee,
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
