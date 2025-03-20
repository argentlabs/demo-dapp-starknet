import { DeclareIcon } from "@/components/icons/DeclareIcon"
import { Button } from "@/components/ui/Button"
import { ErrorText } from "@/components/ui/Error"
import { isMainnet, toHexChainid } from "@/helpers/chainId"
import { useAccount, useDeclareContract } from "@starknet-react/core"
import { useState } from "react"
import { hash } from "starknet"
import { SectionLayout } from "../SectionLayout"
import { FileUploader } from "./FileUploader"

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

  const [selectedContractFile, setSelectedContractFile] = useState<File | null>(
    null,
  )
  const [selectedCompiledFile, setSelectedCompiledFile] = useState<File | null>(
    null,
  )

  if (!account || !address) {
    return null
  }

  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedContractFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setContractJson(reader.result as string)
      }
      reader.readAsText(file)
    } else {
      setSelectedContractFile(null)
    }
  }

  const handleCompiledClassHashChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedCompiledFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setCompiledClassHashJson(reader.result as string)
      }
      reader.readAsText(file)
    } else {
      setSelectedCompiledFile(null)
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
    <SectionLayout sectionTitle="Declare Contract" icon={<DeclareIcon />}>
      <div className="flex flex-1 w-full  rounded-lg">
        <div className="flex flex-col gap-4 w-full">
          <span className="text-lg font-semibold leading-6">
            Upload Contract Files
          </span>
          <div className="flex flex-col gap-4">
            <FileUploader
              title="Contract File (sierra)"
              selectedFile={selectedContractFile}
              onChange={handleContractChange}
              id="contract-file"
            />

            <FileUploader
              title="Compiled Contract File (casm)"
              selectedFile={selectedCompiledFile}
              onChange={handleCompiledClassHashChange}
              id="compiled-file"
            />
          </div>
        </div>
      </div>

      {error && <ErrorText>{error}</ErrorText>}

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
        <Button
          className="w-full mt-3"
          onClick={onDeclare}
          hideChevron
          disabled={!selectedContractFile || !selectedCompiledFile}
        >
          Declare contract
        </Button>
      </div>
    </SectionLayout>
  )
}

export { DeclareContract }
