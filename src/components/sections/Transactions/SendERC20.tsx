import { Flex } from "@/components/ui/Flex"
import { ETHTokenAddress } from "@/constants"
import { parseInputAmountToUint256 } from "@/helper/token"
import {
  Abi,
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core"
import { useState } from "react"
import { Button } from "../../ui/Button"

const abi = [
  {
    type: "function",
    name: "transfer",
    state_mutability: "external",
    inputs: [
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
    ],
    outputs: [],
  },
] as const satisfies Abi

const SendERC20 = () => {
  const [transferTo, setTransferTo] = useState("")
  const [transferAmount, setTransferAmount] = useState("1")

  const [lastTxStatus, setLastTxStatus] = useState("idle")
  const [lastTxError, setLastTxError] = useState("")

  const { account } = useAccount()
  const { contract } = useContract({
    abi,
    address: ETHTokenAddress,
  })

  const { sendAsync } = useSendTransaction({
    calls:
      contract && account?.address
        ? [
            contract.populate("transfer", [
              account?.address,
              parseInputAmountToUint256(transferAmount || "0"),
            ]),
          ]
        : undefined,
  })

  const buttonsDisabled = ["approve"].includes(lastTxStatus)

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      setLastTxError("")
      e.preventDefault()
      setLastTxStatus("approve")
      const { transaction_hash } = await sendAsync()
      alert(`Transaction sent: ${transaction_hash}`)
    } catch (error) {
      setLastTxError((error as Error).message)
    } finally {
      setLastTxStatus("idle")
    }
  }

  return (
    <Flex flex={1} width="100%" gap={10}>
      <form className="full" onSubmit={handleTransferSubmit}>
        <Flex
          flexDirection="column"
          flex={1}
          padding="4"
          gap="12px"
          borderRadius="16px"
        >
          <h3>Send ERC20</h3>
          <input
            type="text"
            id="transfer-to"
            placeholder="To"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
          />

          <input
            type="text"
            id="transfer-amount"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <Button
            type="submit"
            disabled={buttonsDisabled}
            style={{ maxWidth: "200px" }}
          >
            <span>
              {lastTxStatus === "approve"
                ? "Waiting for transaction"
                : "Send transaction"}
            </span>
          </Button>
          {lastTxError ? (
            <span style={{ color: "red" }}>Error: {lastTxError}</span>
          ) : null}
        </Flex>
      </form>
    </Flex>
  )
}

export { SendERC20 }
