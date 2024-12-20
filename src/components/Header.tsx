import { isMainnet, toHexChainid } from "@/helpers/chainId"
import { formatTruncatedAddress } from "@/helpers/formatAddress"
import { useAccount, useBalance, useStarkProfile } from "@starknet-react/core"
import { AvatarIcon } from "./icons/AvatarIcon"
import { LogoIcon } from "./icons/LogoIcon"
import { WalletIcon } from "./icons/WalletIcon"
import { ExternalIcon } from "./icons/ExternalIcon"
import { HeaderConnectButton } from "@/components/HeaderConnectButton"
import Image from "next/image"

const Header = () => {
  const { address, isConnected, chainId } = useAccount()

  const { data: balance } = useBalance({
    address: address,
  })

  const { data } = useStarkProfile({ address })

  const hexChainId = toHexChainid(chainId)

  return (
    <>
      <div className="flex p-5 md:pt-[32px] md:px-[116px] md:pb-[16px] bg-black">
        <div className="flex w-full lg:max-w-[1180px] lg:mx-auto">
          <div className="flex items-center w-full">
            <div className="flex items-center gap-1">
              <div className="w-10 h-10">
                <LogoIcon />
              </div>
              <h1 className="font-normal text-md md:text-xl leading-6 mt-0.5 text-nowrap">
                Demo dapp
              </h1>
            </div>
            <div className="flex flex-1 w-full" />

            {isConnected && (
              <div className="flex border-col rounded-md md:rounded-lg gap-3 p-2 md:p-3 border border-solid border-charcoal font-medium text-sm md:text-base text-nowrap">
                <div className="hidden md:flex items-center gap-2">
                  <WalletIcon />
                  {balance
                    ? balance?.formatted.length > 7
                      ? `${balance.formatted.slice(0, 7)} ETH`
                      : `${balance?.formatted} ETH`
                    : "0 ETH"}
                </div>
                <div className="border-solid border-l-[1px] border-charcoal -my-1 mx-0  hidden md:flex" />
                <div
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() =>
                    window.open(
                      isMainnet(hexChainId)
                        ? `https://voyager.online/contract/${address}`
                        : `https://sepolia.voyager.online/contract/${address}`,
                      "_blank",
                    )
                  }
                >
                  {data?.profilePicture ? (
                    <Image
                      alt="generic_profile"
                      width={20}
                      height={20}
                      className="w-6 h-6"
                      src={data?.profilePicture}
                    />
                  ) : (
                    <AvatarIcon />
                  )}
                  {formatTruncatedAddress(address || "")}
                  <ExternalIcon />
                </div>
              </div>
            )}
            {!isConnected && <HeaderConnectButton />}
          </div>
        </div>
      </div>
    </>
  )
}

export { Header }
