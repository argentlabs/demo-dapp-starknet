import { expect } from "@playwright/test"

import test from "../test"
import { downloadGitHubRelease, unzip } from "../utils"
import config from "../../../config"

test.describe(`Transactions`, () => {
  test.beforeAll(async ({}) => {
    const version = await downloadGitHubRelease()
    const currentVersionDir = await unzip(version)
    config.distDir = currentVersionDir
  })

  test(`send an ERC20 from testDapp`, async ({ extension, browserContext }) => {
    //setup wallet
    await extension.open()
    await extension.recoverWallet(config.testSeed3!)
    await expect(extension.network.networkSelector).toBeVisible()
    await extension.network.selectDefaultNetwork()

    await extension.dapps.requestConnectionFromDapp({
      browserContext,
      useStarknetKitModal: true,
    })
    //accept connection from Argent X
    await extension.dapps.accept.click()

    await extension.dapps.sendERC20transaction({
      browserContext,
      type: "ERC20",
    })
  })

  test(`send an Multicall from testDapp`, async ({
    extension,
    browserContext,
  }) => {
    //setup wallet
    await extension.open()
    await extension.recoverWallet(config.testSeed3!)
    await expect(extension.network.networkSelector).toBeVisible()
    await extension.network.selectDefaultNetwork()

    console.log(extension.account.accountAddress)

    await extension.dapps.requestConnectionFromDapp({
      browserContext,
      useStarknetKitModal: true,
    })
    //accept connection from Argent X
    await extension.dapps.accept.click()

    await extension.dapps.sendERC20transaction({
      browserContext,
      type: "Multicall",
    })
  })
})
