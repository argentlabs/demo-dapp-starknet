import { Flex } from "@/components/ui/Flex"
import { useAccount, useSignTypedData } from "@starknet-react/core"
import { useState } from "react"
import { constants, num, stark } from "starknet"
import { Button } from "../ui/Button"
import { Accordion } from "../ui/Accordion"

const SignMessage = () => {
  const { account, address, chainId } = useAccount()
  const [shortText, setShortText] = useState("")
  const [lastSig, setLastSig] = useState<string[]>([])

  const hexChainId =
    typeof chainId === "bigint"
      ? (num.toHex(chainId ?? 0) as constants.StarknetChainId)
      : null

  const { signTypedDataAsync } = useSignTypedData({
    params: {
      domain: {
        name: "Example DApp",
        chainId: hexChainId || constants.StarknetChainId.SN_SEPOLIA,
        version: "0.0.1",
      },
      types: {
        StarkNetDomain: [
          { name: "name", type: "felt" },
          { name: "chainId", type: "felt" },
          { name: "version", type: "felt" },
        ],
        Message: [{ name: "message", type: "felt" }],
      },
      primaryType: "Message",
      message: {
        message: shortText,
      },
    },
  })

  const handleSignSubmit = async () => {
    try {
      if (!account) {
        throw new Error("Account not connected")
      }
      const result = await signTypedDataAsync()
      setLastSig(stark.formatSignature(result))
    } catch (e) {
      console.error(e)
    }
  }

  if (!account || !address) {
    return null
  }

  return (
    <>
      <Accordion
        items={[
          {
            title: "Sign Message",
            content: (
              <>
                <Flex flex={1} width="100%" marginBottom="16px">
                  <form
                    className="full"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSignSubmit()
                    }}
                  >
                    <Flex
                      flexDirection="column"
                      flex={1}
                      padding="4"
                      gap="12px"
                      width="100%"
                    >
                      <input
                        type="text"
                        id="short-text"
                        name="short-text"
                        placeholder="Short text"
                        className="full"
                        value={shortText}
                        onChange={(e) => setShortText(e.target.value)}
                      />

                      <Button type="submit" style={{ maxWidth: "100px" }}>
                        Sign
                      </Button>
                    </Flex>
                  </form>
                </Flex>
                <Flex flexDirection="column" flex={1} padding="4" gap="12px">
                  {lastSig && lastSig.length > 0 && (
                    <>
                      {lastSig.length % 2 === 0 ? (
                        <>
                          <textarea
                            id="r"
                            name="r"
                            placeholder="r"
                            value={lastSig[0]}
                            readOnly
                          />
                          <textarea
                            id="s"
                            name="s"
                            placeholder="s"
                            value={lastSig[1]}
                            readOnly
                          />
                        </>
                      ) : (
                        <>
                          <Flex flexDirection="column" gap="4px">
                            <h4>Signer</h4>
                            <textarea
                              id="signer"
                              name="signer"
                              placeholder="signer"
                              value={lastSig[2]}
                              readOnly
                            />
                          </Flex>
                          <Flex flexDirection="column" gap="4px">
                            <h4>r</h4>
                            <textarea
                              id="r"
                              name="r"
                              placeholder="r"
                              value={lastSig[3]}
                              readOnly
                            />
                          </Flex>
                          <Flex flexDirection="column" gap="4px">
                            <h4>s</h4>
                            <textarea
                              id="s"
                              name="s"
                              placeholder="s"
                              value={lastSig[4]}
                              readOnly
                            />
                          </Flex>
                          {lastSig.length > 5 && (
                            <>
                              <Flex flexDirection="column" gap="4px">
                                <h4>Cosigner</h4>
                                <textarea
                                  id="signer"
                                  name="signer"
                                  placeholder="signer"
                                  value={lastSig[6]}
                                  readOnly
                                />
                              </Flex>
                              <Flex flexDirection="column" gap="4px">
                                <h4>r</h4>
                                <textarea
                                  id="r"
                                  name="r"
                                  placeholder="r"
                                  value={lastSig[7]}
                                  readOnly
                                />
                              </Flex>
                              <Flex flexDirection="column" gap="4px">
                                <h4>s</h4>
                                <textarea
                                  id="s"
                                  name="s"
                                  placeholder="s"
                                  value={lastSig[8]}
                                  readOnly
                                />
                              </Flex>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Flex>
              </>
            ),
          },
        ]}
      />
    </>
  )
}

export { SignMessage }
