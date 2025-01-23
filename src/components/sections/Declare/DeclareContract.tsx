// import { useAccount, useDeclareContract } from "@starknet-react/core"
import { useState } from "react"
import { SectionLayout } from "../SectionLayout"
import { Button } from "@/components/ui/Button"
import { useAccount, useDeclareContract } from "@starknet-react/core"
import { hash } from "starknet"
import { isMainnet, toHexChainid } from "@/helpers/chainId"

const DeclareContract = () => {
  const { account, address, chainId } = useAccount()
  const { declareAsync } = useDeclareContract({})
  const [contractJson, setContractJson] = useState<string | null>(null)
  const [compiledClassHashJson, setCompiledClassHashJson] = useState<
    string | null
  >(null)
  const [declaredClassHash, setDeclaredClassHash] = useState<string | null>()
  const [txHash, setTxHash] = useState<string | null>()
  const [error, setError] = useState<string | null>()

  if (!account || !address) {
    return null
  }

  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setContractJson(reader.result as string)
      }
      reader.readAsText(file)
    }
  }

  const handleCompiledClassHashChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setCompiledClassHashJson(reader.result as string)
      }
      reader.readAsText(file)
    }
  }

  const onDeclare = async () => {
    try {
      const { class_hash, transaction_hash } = await declareAsync({
        contract_class: JSON.parse(contractJson || ""),
        compiled_class_hash: hash.computeCompiledClassHash(
          JSON.parse(compiledClassHashJson || ""),
        ),
      })

      setDeclaredClassHash(class_hash)
      setTxHash(transaction_hash)
    } catch (e) {
      setError((e as Error).message)
    }
  }
  const openTxOnVoyager = () => {
    const hexChainId = toHexChainid(chainId)

    window.open(
      isMainnet(hexChainId)
        ? `https://voyager.online/tx/${txHash}`
        : `https://sepolia.voyager.online/tx/${txHash}`,
      "_blank",
    )
  }

  const openClassHashOnVoyager = () => {
    const hexChainId = toHexChainid(chainId)
    window.open(
      isMainnet(hexChainId)
        ? `https://voyager.online/class/${declaredClassHash}`
        : `https://sepolia.voyager.online/class/${declaredClassHash}`,
      "_blank",
    )
  }

  return (
    <SectionLayout sectionTitle="Declare Contract">
      <div className="flex flex-1 w-full bg-raisin-black rounded-lg p-3">
        <div className="flex flex-col gap-4 w-full">
          <span className="text-base font-medium leading-6">
            Upload Contract Files
          </span>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="contract-file" className="text-sm">
                Contract File (sierra)
              </label>
              <input
                type="file"
                id="contract-file"
                accept=".json"
                onChange={handleContractChange}
                className="w-full outline-none focus:border-white focus:text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="compiled-file" className="text-sm">
                Compiled Contract File (casm)
              </label>
              <input
                type="file"
                id="compiled-file"
                accept=".json"
                onChange={handleCompiledClassHashChange}
                className="w-full outline-none focus:border-white focus:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex flex-col gap-2 w-full p-4 border border-solid border-raisin-black  rounded-lg shadow-md">
          <span className="text-md font-semibold text-red-600">Error</span>
          <span className="text-sm ">{error}</span>
        </div>
      )}

      {declaredClassHash && txHash && (
        <div className="flex flex-col gap-6 w-full p-4 border border-solid border-raisin-black rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <span className="text-md font-semibold text-white">
              Declared Contract Hash
            </span>
            <span
              className="text-sm text-gray-400 break-all cursor-pointer"
              onClick={openClassHashOnVoyager}
            >
              {declaredClassHash}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-md font-semibold text-white">
              Transaction Hash
            </span>
            <span
              className="text-sm text-gray-400 break-all cursor-pointer"
              onClick={openTxOnVoyager}
            >
              {txHash}
            </span>
          </div>
        </div>
      )}

      <div className="flex  justify-center">
        <Button className="w-full mt-3" onClick={onDeclare} hideChevron>
          Declare contract
        </Button>
      </div>
    </SectionLayout>
  )
}

export { DeclareContract }
