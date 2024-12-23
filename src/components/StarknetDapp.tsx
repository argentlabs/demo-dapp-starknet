"use client"
import { SignMessage } from "@/components/sections/SignMessage"
import { Transactions } from "@/components/sections/Transactions/Transactions"
import { useAccount } from "@starknet-react/core"
import { useState } from "react"
import { Connect } from "./connect/Connect"
import { Header } from "./Header"
import { GithubLogo } from "./icons/GithubLogo"
import { AccountStatus } from "./sections/AccountStatus"
import { AddToken } from "./sections/ERC20/AddToken"
import { Network } from "./sections/Network/Network"
import { SectionButton } from "./sections/SectionButton"
import { SectionLayout } from "./sections/SectionLayout"
import { SessionKeysSign } from "./sections/SessionKeys/SessionKeysSign"
import { Section } from "./sections/types"

const StarknetDapp = () => {
  const [section, setSection] = useState<Section | undefined>(undefined)
  const { isConnected } = useAccount()

  return (
    <div className="flex w-full h-full column">
      <Header />

      <div className="flex p-5 md:py-[56px] md:px-[116px] bg-black">
        <div className="flex w-full lg:max-w-[1178px] lg:mx-auto md:gap-20 lg:gap-[130px]">
          <div className="flex column gap-2.5 w-full max-w-[362px]">
            <h1 className="get-started-title text-[32px] leading-[34px] md:text-[40px] md:leading-[42px] text-white font-semibold text-left">
              your
            </h1>
            <span className="text-dark-grey text-base font-normal leading-6 md:font-medium text-left">
              Starknet utilizes the power of STARK technology to ensure
              computational integrity.
            </span>
          </div>

          <div className="w-full hidden md:grid sm:gap-5 lg:gap-10 xl:gap-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AccountStatus />
          </div>
        </div>
      </div>

      {!section && (
        <div className="md:hidden w-dvw h-dvh fixed bg-backdrop pointer-events-none"></div>
      )}

      <div className="flex p-5 gap-3  md:py-[56px] md:px-[116px]  flex-1 h-full">
        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-20 lg:gap-[130px] lg:max-w-[1178px] lg:mx-auto">
          <div className="flex w-full column md:max-w-[362px] z-10">
            <SectionButton
              section="Status"
              setSection={setSection}
              selected={section === "Status"}
              className={`md:hidden ${!section ? "md:flex mb-3" : section === "Status" ? "flex" : "hidden"}`}
            />

            <div
              className={`flex w-full column gap-3 md:max-w-[362px]
              ${!section ? "rounded-lg border border-black border-solid md:border-0 p-2 md:p-0" : ""}`}
            >
              <SectionButton
                section="Connection"
                setSection={setSection}
                selected={section === "Connection"}
                className={`${!section ? "md:flex" : section === "Connection" ? "flex" : "md:flex hidden"}`}
              />
              <SectionButton
                section="Transactions"
                setSection={setSection}
                selected={section === "Transactions"}
                disabled={!isConnected}
                className={`${!section ? "flex" : section === "Transactions" ? "flex" : "md:flex hidden"}`}
              />
              <SectionButton
                section="Signing"
                setSection={setSection}
                selected={section === "Signing"}
                disabled={!isConnected}
                className={`${!section ? "flex" : section === "Signing" ? "flex" : "md:flex hidden"}`}
              />
              <SectionButton
                section="Network"
                setSection={setSection}
                selected={section === "Network"}
                disabled={!isConnected}
                className={`${!section ? "flex" : section === "Network" ? "flex" : "md:flex hidden"}`}
              />
              <SectionButton
                section="ERC20"
                setSection={setSection}
                selected={section === "ERC20"}
                disabled={!isConnected}
                className={`${!section ? "flex" : section === "ERC20" ? "flex" : "md:flex hidden"}`}
              />
              <SectionButton
                section="SessionKeys"
                label="Session Keys"
                setSection={setSection}
                selected={section === "SessionKeys"}
                disabled={!isConnected}
                className={`${!section ? "flex" : section === "SessionKeys" ? "flex" : "md:flex hidden"}`}
              />
            </div>
          </div>

          <div className="flex flex-1 w-full">
            {section === "Status" && (
              <SectionLayout sectionTitle="Status">
                <div className="w-full grid gap-5 grid-cols-2 ">
                  <AccountStatus />
                </div>
              </SectionLayout>
            )}
            {section === "Connection" && <Connect />}
            {section === "Transactions" && <Transactions />}
            {section === "Signing" && <SignMessage />}
            {section === "Network" && <Network />}
            {section === "ERC20" && <AddToken />}
            {section === "SessionKeys" && <SessionKeysSign />}
          </div>
        </div>
      </div>

      <a
        href="https://github.com/argentlabs/demo-dapp-starknet"
        target="_blank"
        rel="noreferrer"
      >
        <div className="flex items-center cursor-pointer w-full justify-center p-5 md:py-10 md:px-[116px] text-lavander-sky gap-2">
          <GithubLogo />
          Github
        </div>
      </a>
    </div>
  )
}

export { StarknetDapp }
