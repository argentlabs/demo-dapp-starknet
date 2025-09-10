import { dummyContractAbi } from "@/abi/dummyContractAbi"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import { ARGENT_DUMMY_CONTRACT_ADDRESS } from "@/constants"
import { useAccount, useContract } from "@starknet-react/core"
import { FC, useState } from "react"
import { CallData } from "starknet"
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
    if (!address) {
      throw new Error("No address")
    }

    if (!sessionAccount) {
      throw new Error("No session account")
    }

    if (!contract) {
      throw new Error("No contract")
    }

    try {
      setIsSubmitting(true)

      // https://www.starknetjs.com/docs/guides/estimate_fees/#estimateinvokefee
      const { resourceBounds } = await sessionAccount.estimateInvokeFee({
        contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
        entrypoint: "set_number",
        calldata: CallData.compile(["1"]),
      })

      const { transaction_hash } = await sessionAccount.execute(
        {
          contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
          entrypoint: "set_number",
          calldata: CallData.compile(["1"]),
        },
        {
          resourceBounds: {
            ...resourceBounds,
            // just for demo purposes
            l2_gas: {
              max_amount: BigInt("0x200000"), // 2,097,152 gas units
              max_price_per_unit: BigInt("0x2540be400"), // 10 gwei
            },
          },
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
