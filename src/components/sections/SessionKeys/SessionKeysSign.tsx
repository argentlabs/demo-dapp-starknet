import { SessionKeysIcon } from "@/components/icons/SessionKesIcon"
import { Button } from "@/components/ui/Button"
import { ErrorText } from "@/components/ui/Error"
import {
  AVNU_PAYMASTER_API_KEY,
  getNetworkConfig,
  getProvider,
} from "@/constants"
import {
  expiry,
  getAllowedMethods,
  metaData,
  sessionKey,
} from "@/helpers/sessionKeys"
import {
  buildSessionAccount,
  createSession,
  CreateSessionParams,
  createSessionRequest,
  Session,
} from "@argent/x-sessions"
import { useAccount, useSignTypedData } from "@starknet-react/core"
import { useState } from "react"
import { Account, AccountInterface } from "starknet"
import { SectionLayout } from "../SectionLayout"
import { SessionKeysExecute } from "./SessionKeysExecute"
import { SessionKeysExecuteOutside } from "./SessionKeysExecuteOutside"
import { SessionKeysExecutePaymaster } from "./SessionKeysExecutePaymaster"
import { SessionKeysTypedDataOutside } from "./SessionKeysTypedDataOutside"

const SessionKeysSign = () => {
  const { address, chainId } = useAccount()
  const [session, setSession] = useState<Session>()
  const [sessionAccount, setSessionAccount] = useState<
    Account | AccountInterface | undefined
  >()

  const [sessionError, setSessionError] = useState("")

  const network = getNetworkConfig(chainId)
  const allowedMethods = getAllowedMethods(network)

  const sessionParams: CreateSessionParams = {
    allowedMethods,
    expiry,
    metaData,
    sessionKey,
  }

  const sessionRequest = createSessionRequest({
    sessionParams,
    chainId: network.starknetChainId,
  })

  const { signTypedDataAsync } = useSignTypedData({
    params: sessionRequest.sessionTypedData,
  })

  const handleSignSessionKeys = async () => {
    if (!address || !chainId) {
      throw new Error("No address or chainId")
    }

    try {
      const authorisationSignature = await signTypedDataAsync()
      const sessionObj = await createSession({
        address: address,
        chainId: network.starknetChainId,
        authorisationSignature,
        sessionRequest,
      })

      const sessionAccount = await buildSessionAccount({
        session: sessionObj,
        sessionKey,
        provider: getProvider(chainId),
        argentSessionServiceBaseUrl: network.sessionServiceBaseUrl,
      })

      setSession(sessionObj)
      setSessionAccount(sessionAccount)
    } catch (e) {
      console.error(e)
      setSessionError((e as Error).message)
    }
  }

  return (
    <SectionLayout sectionTitle="Session Keys" icon={<SessionKeysIcon />}>
      <Button className="w-full" onClick={handleSignSessionKeys} hideChevron>
        Create session
      </Button>
      <SessionKeysExecute network={network} sessionAccount={sessionAccount} />
      <SessionKeysExecuteOutside
        network={network}
        session={session}
        sessionAccount={sessionAccount}
      />
      <SessionKeysTypedDataOutside
        network={network}
        session={session}
        sessionAccount={sessionAccount}
      />
      {AVNU_PAYMASTER_API_KEY && network.xSessionsNetwork === "sepolia" && (
        <SessionKeysExecutePaymaster
          network={network}
          session={session}
          sessionAccount={sessionAccount}
        />
      )}
      {sessionError ? <ErrorText>{sessionError}</ErrorText> : null}
    </SectionLayout>
  )
}

export { SessionKeysSign }
