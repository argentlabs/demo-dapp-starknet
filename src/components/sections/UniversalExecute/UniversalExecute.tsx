import { TransactionsIcon } from "@/components/icons/TransactionsIcon"
import { Button } from "@/components/ui/Button"
import {
  RequestResult,
  useAccount,
  useWalletRequest,
  UseWalletRequestProps,
} from "@starknet-react/core"
import { useState } from "react"
import { SectionLayout } from "../SectionLayout"

const UniversalExecute = () => {
  const { account, address } = useAccount()
  const [transactionParam, setTransactionParam] = useState<
    UseWalletRequestProps<"wallet_addInvokeTransaction"> | undefined
  >(undefined)

  const [lastTxStatus, setLastTxStatus] = useState("idle")
  const [lastTxError, setLastTxError] = useState("")

  const [jsonFormatError, setJsonFormatError] = useState(false)
  const [displayTransactionParam, setDisplayTransactionParam] = useState<
    string | undefined
  >(undefined)

  const { requestAsync } = useWalletRequest(
    transactionParam
      ? (transactionParam as UseWalletRequestProps<"wallet_addInvokeTransaction">)
      : {},
  )

  const buttonsDisabled = ["approve"].includes(lastTxStatus)

  const handleTxSubmit = async () => {
    try {
      if (!account) {
        throw new Error("Account not connected")
      }

      if (jsonFormatError) {
        throw new Error("JSON Format Error")
      }

      setLastTxError("")
      setJsonFormatError(false)
      setLastTxStatus("approve")
      const { transaction_hash } =
        (await requestAsync()) as RequestResult<"wallet_addInvokeTransaction">
      setTimeout(() => {
        alert(`Transaction sent: ${transaction_hash}`)
      })
    } catch (e) {
      setLastTxError((e as Error).message)
    } finally {
      setLastTxStatus("idle")
    }
  }

  if (!account || !address) {
    return null
  }

  return (
    <SectionLayout
      sectionTitle="Execute Custom Transaction"
      icon={<TransactionsIcon />}
    >
      <div className="flex flex-1 w-full bg-raisin-black rounded-lg p-3">
        <form
          className="flex flex-1 flex-col w-full gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleTxSubmit()
          }}
        >
          <span className="text-base font-medium leading-6">
            Transaction to execute
          </span>
          <textarea
            id="short-text"
            name="short-text"
            placeholder={`// Example tx - please replace before executing
[
  {
    "contract_address": "your_address",
		"entry_point": "your_entry_point",
		"calldata": [your_calldata]
	}
]`}
            className="w-full outline-none focus:border-white focus:text-white"
            value={displayTransactionParam}
            style={{ minHeight: "350px" }}
            onChange={(e) => {
              setDisplayTransactionParam(e.target.value)

              try {
                setJsonFormatError(false)
                setTransactionParam(
                  JSON.parse(
                    `{"type": "wallet_addInvokeTransaction", "params": { "calls": ${e.target.value} } }`,
                  ),
                )
              } catch {
                setJsonFormatError(true)
                return
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              style={{
                fontSize: "14px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                lineHeight: "16px",
                height: "36px",
                maxWidth: "175px",
                textAlign: "center",
                width: "100%",
              }}
              disabled={!displayTransactionParam || buttonsDisabled}
              hideChevron
            >
              {lastTxStatus === "approve"
                ? "Waiting for transaction"
                : "Submit"}
            </Button>
          </div>
          {lastTxError ? (
            <span style={{ color: "red" }}>Error: {lastTxError}</span>
          ) : null}
        </form>
      </div>
    </SectionLayout>
  )
}

export { UniversalExecute }
