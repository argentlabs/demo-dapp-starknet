import { toHexChainid } from "@/helpers/chainId"
import { useAccount, useSignTypedData } from "@starknet-react/core"
import { useState } from "react"
import { constants, stark } from "starknet"
import { Button } from "../ui/Button"
import { SectionLayout } from "./SectionLayout"
import { SigningIcon } from "../icons/SigningIcon"

const SignMessage = () => {
  const { account, address, chainId } = useAccount()
  const [shortText, setShortText] = useState("")
  const [lastSig, setLastSig] = useState<string[]>([])

  const hexChainId = toHexChainid(chainId)

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
    <SectionLayout sectionTitle="Signing" icon={<SigningIcon />}>
      <div className="flex flex-1 w-full bg-raisin-black rounded-lg p-3">
        <form
          className="flex flex-1 flex-col w-full gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSignSubmit()
          }}
        >
          <span className="text-base font-medium leading-6">Sign message</span>
          <textarea
            id="short-text"
            name="short-text"
            placeholder="Message"
            className="w-full outline-none focus:border-white focus:text-white"
            value={shortText}
            style={{ height: "160px" }}
            onChange={(e) => setShortText(e.target.value)}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              style={{
                fontSize: "14px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                lineHeight: "16px",
                height: "36px",
                maxWidth: "175px",
                textAlign: "center",
                width: "100%",
              }}
              disabled={!shortText}
              hideChevron
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
      <div className="flex column p-1 gap-3" style={{ flex: "1" }}>
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
                <div className="flex column gap-1">
                  <h4>Signer</h4>
                  <textarea
                    id="signer"
                    name="signer"
                    placeholder="signer"
                    value={lastSig[2]}
                    readOnly
                  />
                </div>
                <div className="flex column gap-1">
                  <h4>r</h4>
                  <textarea
                    id="r"
                    name="r"
                    placeholder="r"
                    value={lastSig[3]}
                    readOnly
                  />
                </div>
                <div className="flex column gap-1">
                  <h4>s</h4>
                  <textarea
                    id="s"
                    name="s"
                    placeholder="s"
                    value={lastSig[4]}
                    readOnly
                  />
                </div>
                {lastSig.length > 5 && (
                  <>
                    <div className="flex column gap-1">
                      <h4>Cosigner</h4>
                      <textarea
                        id="signer"
                        name="signer"
                        placeholder="signer"
                        value={lastSig[6]}
                        readOnly
                      />
                    </div>
                    <div className="flex column gap-1">
                      <h4>r</h4>
                      <textarea
                        id="r"
                        name="r"
                        placeholder="r"
                        value={lastSig[7]}
                        readOnly
                      />
                    </div>
                    <div className="flex column gap-1">
                      <h4>s</h4>
                      <textarea
                        id="s"
                        name="s"
                        placeholder="s"
                        value={lastSig[8]}
                        readOnly
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </SectionLayout>
  )
}

export { SignMessage }
