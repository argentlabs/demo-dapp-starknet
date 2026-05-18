import { dummyContractAbi } from "@/abi/dummyContractAbi"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import {
  ARGENT_DUMMY_CONTRACT_ADDRESS,
  ARGENT_SESSION_SERVICE_BASE_URL,
  AVNU_PAYMASTER_API_KEY,
  CHAIN_ID,
} from "@/constants"
import { sessionKey } from "@/helpers/sessionKeys"
import { signOutsideExecution } from "@argent/x-sessions"
import { useAccount, useContract } from "@starknet-react/core"
import { FC, useState } from "react"
import { CallData, stark } from "starknet"
import { WithSession } from "./types"

/**
 * This example is working on sepolia only
 * AVNU api key is mandatory (set in your .env file)
 */
const SessionKeysExecutePaymaster: FC<WithSession> = ({
  sessionAccount,
  session,
}) => {
  const { address } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { contract } = useContract({
    abi: dummyContractAbi,
    address: ARGENT_DUMMY_CONTRACT_ADDRESS,
    provider: sessionAccount,
  })

  const handleSessionExecute = async () => {
    if (!AVNU_PAYMASTER_API_KEY) {
      throw new Error("No paymaster API key")
    }

    if (!address) {
      throw new Error("No address")
    }

    if (!sessionAccount) {
      throw new Error("No session account")
    }

    if (!contract) {
      throw new Error("No contract")
    }

    if (!session) {
      throw new Error("No session")
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(
        "https://sepolia.api.avnu.fi/paymaster/v1/build-typed-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": AVNU_PAYMASTER_API_KEY,
          },
          body: JSON.stringify({
            userAddress: address,
            calls: [
              {
                contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
                entrypoint: "set_number",
                calldata: ["0x1"],
              },
            ],
          }),
        },
      )

      const typedData = await response.json()
      const signOutsideExecutionResponse = await signOutsideExecution({
        session,
        sessionKey,
        outsideExecutionTypedData: typedData,
        calls: [
          {
            contractAddress: ARGENT_DUMMY_CONTRACT_ADDRESS,
            entrypoint: "set_number",
            calldata: CallData.compile(["0x1"]),
          },
        ],
        network: CHAIN_ID === "SN_SEPOLIA" ? "sepolia" : "mainnet",
        argentSessionServiceUrl: ARGENT_SESSION_SERVICE_BASE_URL,
      })

      const executeResponse = await fetch(
        "https://sepolia.api.avnu.fi/paymaster/v1/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": AVNU_PAYMASTER_API_KEY,
          },
          body: JSON.stringify({
            signature: stark.formatSignature(signOutsideExecutionResponse),
            userAddress: address,
            typedData: JSON.stringify(typedData),
          }),
        },
      )

      const { transactionHash } = await executeResponse.json()

      setTimeout(() => {
        alert(`Transaction sent: ${transactionHash}`)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h4>Execute session transaction with AVNU paymaster</h4>
      <Button
        className="w-full"
        disabled={!sessionAccount || isSubmitting}
        onClick={handleSessionExecute}
        hideChevron
      >
        Submit session + AVNU paymaster tx {isSubmitting ? <Spinner /> : ""}
      </Button>
    </>
  )
}

export { SessionKeysExecutePaymaster }
