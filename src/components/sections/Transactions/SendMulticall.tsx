// TokenOperations.tsx

const SendMulticall = () => {
  /* const { account } = useAccount()

  const [lastTxStatus, setLastTxStatus] = useState("idle")
  const [lastTxError, setLastTxError] = useState("")

  const { contract } = useContract({
    abi: erco20TransferAbi,
    address: ETHTokenAddress,
  })

  const { sendAsync } = useSendTransaction({
    calls:
      contract && account?.address
        ? [
            contract.populate("transfer", [
              account?.address,
              parseInputAmountToUint256("0.000000001"),
            ]),
            contract.populate("transfer", [
              account?.address,
              parseInputAmountToUint256("0.000000002"),
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
      setTimeout(() => {
        alert(`Transaction sent: ${transaction_hash}`)
      })
    } catch (error) {
      setLastTxError((error as Error).message)
    } finally {
      setLastTxStatus("idle")
    }
  } */

  return <></>
}

export { SendMulticall }
