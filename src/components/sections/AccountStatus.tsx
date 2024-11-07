import {
  useAccount,
  useBalance,
  useConnect,
  useStarkName,
  useStarkProfile,
} from "@starknet-react/core"
import { FC } from "react"
import { constants, num } from "starknet"
import { Accordion } from "../ui/Accordion"
import { Flex } from "../ui/Flex"

const Box: FC<{
  title: string
  value?: string
}> = ({ title, value }) => (
  <Flex flex={1} border="solid 1px #C8C8C8" borderRadius="8px" padding="8px">
    <span style={{ fontWeight: "bold" }}>
      {title}: {value || "-----"}
    </span>
  </Flex>
)

const AccountStatus = () => {
  const { address, isConnected, chainId } = useAccount()
  const { connector } = useConnect()

  const { data: balance } = useBalance({
    address: address,
  })

  const { data: starknetId } = useStarkName({
    address,
  })

  const { data: starkProfile } = useStarkProfile({
    address,
  })

  const hexChainId =
    typeof chainId === "bigint" ? num.toHex(chainId ?? 0) : null

  return (
    <Flex flexDirection="column" gap="24px">
      <Accordion
        isDefaultOpen
        items={[
          {
            title: "Status",
            content: (
              <Flex flexDirection="column" gap="12px">
                <Flex gap="12px">
                  <Box
                    title="Status"
                    value={isConnected ? "Connected" : "Not connected"}
                  />
                  <Box title="Connector" value={connector?.name} />
                </Flex>
                <Flex gap="12px" width="100%">
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
                  {balance ? (
                    <Box
                      title="Eth Balance"
                      value={
                        balance && balance?.formatted.length > 7
                          ? `${balance.formatted.slice(0, 5)} ETH`
                          : `${balance?.formatted} ETH`
                      }
                    />
                  ) : (
                    <Box title="Eth Balance" value="----" />
                  )}
                </Flex>
                <Accordion
                  withBorder
                  items={[
                    {
                      title: "StarknetID data",
                      content: (
                        <Flex flexDirection="column" gap="12px" padding="8px">
                          <Box title="ID" value={starknetId} />
                          <Box
                            title="Avatar Url"
                            value={starkProfile?.profilePicture}
                          />
                        </Flex>
                      ),
                    },
                  ]}
                />
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  )
}

export { AccountStatus }
