import { ARGENT_DUMMY_CONTRACT_ADDRESS, CHAIN_ID } from "@/constants"
import { useAccount, useContract } from "@starknet-react/core"
import { constants } from "starknet"
import { dummyContractAbi } from "../../../../abi/dummyContractAbi"
import { WithSessionAccount } from "../types"

const useMainnetContract = ({ sessionAccount }: WithSessionAccount) => {
  const { address } = useAccount()
  const { contract: mainnetContract } = useContract({
    abi: dummyContractAbi,
    address: ARGENT_DUMMY_CONTRACT_ADDRESS,
    provider: sessionAccount,
  })

  const submitMainnetTransaction = async () => {
    if (!address) {
      throw new Error("No address")
    }

    if (!sessionAccount) {
      throw new Error("No session account")
    }

    const transferCallData = mainnetContract.populate("set_number", {
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
    const { transaction_hash } = await mainnetContract.set_number(
      transferCallData.calldata,
      {
        maxFee,
      },
    )
    return transaction_hash
  }

  return CHAIN_ID === constants.NetworkName.SN_MAIN
    ? submitMainnetTransaction
    : null
}

export { useMainnetContract }
