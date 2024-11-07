"use client"
import { SignMessage } from "@/components/sections/SignMessage"
import { Transactions } from "@/components/sections/Transactions/Transactions"
import { Connect } from "./connect/Connect"
import { Flex } from "./ui/Flex"
import { AccountStatus } from "./sections/AccountStatus"
import { AddToken } from "./sections/ERC20/AddToken"
import { Network } from "./sections/Network/Network"

const StarknetDapp = () => (
  <Flex
    flexDirection="column"
    maxWidth="500px"
    width="100%"
    margin="0 auto"
    gap="24px"
  >
    <AccountStatus />
    <Connect />
    <Transactions />
    <SignMessage />
    <Network />
    <AddToken />
  </Flex>
)

export { StarknetDapp }
