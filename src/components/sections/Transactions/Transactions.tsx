import { TransactionsIcon } from "@/components/icons/TransactionsIcon"
import { useAccount } from "@starknet-react/core"
import { SectionLayout } from "../SectionLayout"
import { SendERC20 } from "../Transactions/SendERC20"
import { SendMulticall } from "../Transactions/SendMulticall"
import { useState } from "react"
import { ErrorText } from "@/components/ui/Error"

const Transactions = () => {
  const { account, address } = useAccount()
  const [lastTxError, setLastTxError] = useState("")

  if (!account || !address) {
    return null
  }

  return (
    <SectionLayout sectionTitle="Transactions" icon={<TransactionsIcon />}>
      <div className="flex flex-col lg:flex-row gap-3">
        <SendERC20 setLastTxError={setLastTxError} />
        <SendMulticall setLastTxError={setLastTxError} />
      </div>
      {lastTxError ? <ErrorText>Error: {lastTxError}</ErrorText> : null}
    </SectionLayout>
  )
}

export { Transactions }
