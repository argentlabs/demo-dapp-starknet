import { CHAIN_ID, ETHTokenAddress } from "@/constants"
import { parseInputAmountToUint256 } from "@/helpers/token"
import { useAccount, useContract } from "@starknet-react/core"
import { constants } from "starknet"
import { erco20TransferAbi } from "../../../../abi/erc20TransferAbi"
import { WithSessionAccount } from "../types"

const useTestnetContract = ({ sessionAccount }: WithSessionAccount) => {
  const { address } = useAccount()
  const { contract } = useContract({
    abi: erco20TransferAbi,
    address: ETHTokenAddress,
    provider: sessionAccount,
  })

  const submitTestnetTransaction = async () => {
    if (!address) {
      throw new Error("No address")
    }

    if (!sessionAccount) {
      throw new Error("No session account")
    }

    const transferCallData = contract.populate("transfer", {
      recipient: address.toString(),
      amount: parseInputAmountToUint256("0.000000001"),
    })

    // https://www.starknetjs.com/docs/guides/estimate_fees/#estimateinvokefee
    const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
      contractAddress: ETHTokenAddress,
      entrypoint: "transfer",
      calldata: transferCallData.calldata,
    })

    // https://www.starknetjs.com/docs/guides/estimate_fees/#fee-limitation
    const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)
    // send to same account
    const { transaction_hash } = await contract.transfer(
      transferCallData.calldata,
      {
        maxFee,
      },
    )
    return transaction_hash
  }

  return CHAIN_ID === constants.NetworkName.SN_SEPOLIA
    ? submitTestnetTransaction
    : null
}

export { useTestnetContract }
