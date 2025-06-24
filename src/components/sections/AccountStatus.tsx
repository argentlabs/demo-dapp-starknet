import { toHexChainid } from "@/helpers/chainId"
import {
  useAccount,
  useBalance,
  useConnect,
  useStarkName,
  useStarkProfile,
} from "@starknet-react/core"
import { FC, useState } from "react"
import { constants } from "starknet"
import { CopyIcon } from "../icons/CopyIcon"
import { Toast } from "../ui/Toast"

interface BoxProps {
  title: string
  value?: string
  copy?: boolean
  truncate?: boolean
  setShowToast?: (show: boolean) => void
}

const Box: FC<BoxProps> = ({ title, value, copy, truncate, setShowToast }) => (
  <div className="flex flex-col rounded gap-2 overflow-hidden">
    <span className="text-sm font-medium leading-4 text-left text-medium-grey text-color-dark-grey">
      {title}
    </span>
    <div className="flex items-center relative">
      <span
        className={`text-base font-medium leading-6 text-left ${truncate ? "truncate pr-6" : ""} font-size-[16px] ${!value ? "text-lavander-sky" : "text-color-white"}`}
      >
        {value || "-"}
      </span>
      {value && copy && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <CopyIcon
            onClick={() => {
              navigator.clipboard.writeText(value || "")
              setShowToast?.(true)
            }}
          />
        </div>
      )}
    </div>
  </div>
)

const AccountStatus = () => {
  const { address, isConnected, chainId } = useAccount()
  const { connector } = useConnect()
  const [showToast, setShowToast] = useState(false)

  const { data: balance } = useBalance({
    address: address,
  })

  const { data: starknetId } = useStarkName({
    address,
  })

  const { data: starkProfile } = useStarkProfile({
    address,
    useDefaultPfp: true,
    enabled: true,
  })

  const hexChainId = toHexChainid(chainId)

  return (
    <>
      <Box title="Status" value={isConnected ? "Connected" : "Not connected"} />
      <Box
        title="Connector"
        value={isConnected ? connector?.name : undefined}
      />
      <Box
        title="Network"
        value={
          hexChainId
            ? constants.StarknetChainId.SN_SEPOLIA === hexChainId
              ? "Sepolia"
              : "Mainnet"
            : undefined
        }
      />
      <Box
        title="Eth Balance"
        value={
          balance
            ? balance?.formatted.length > 7
              ? `${balance.formatted.slice(0, 7)} ETH`
              : `${balance?.formatted} ETH`
            : undefined
        }
      />
      <Box title="ID" value={starknetId} />
      <Box
        title="Avatar Url"
        value={starkProfile?.profilePicture}
        copy
        truncate
        setShowToast={setShowToast}
      />

      <Toast
        show={showToast}
        hide={() => setShowToast(false)}
        message="Link copied."
      />
    </>
  )
}

export { AccountStatus }
