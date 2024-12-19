import { Session } from "@argent/x-sessions"
import { Account, AccountInterface } from "starknet"

export interface WithSessionAccount {
  sessionAccount?: Account | AccountInterface
}

export interface WithSession extends WithSessionAccount {
  session: Session | undefined
}
