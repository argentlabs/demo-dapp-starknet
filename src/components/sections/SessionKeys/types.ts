import { NetworkConfig } from "@/constants"
import { Session } from "@argent/x-sessions"
import { Account, AccountInterface } from "starknet"

export interface WithSessionAccount {
  network: NetworkConfig
  sessionAccount?: Account | AccountInterface
}

export interface WithSession extends WithSessionAccount {
  session: Session | undefined
}
