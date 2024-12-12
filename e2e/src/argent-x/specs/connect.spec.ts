import { expect } from "@playwright/test"

import test from "../test"
import { downloadGitHubRelease, unzip } from "../utils"
import config from "../../../config"

test.describe("Connect", () => {
  test.beforeAll(async ({}) => {
    const version = await downloadGitHubRelease()
    const currentVersionDir = await unzip(version)
    config.distDir = currentVersionDir
  })
  for (const useStarknetKitModal of [true, false] as const) {
    test(`connect from testDapp using starknetKitModal ${useStarknetKitModal}`, async ({
      extension,
      browserContext,
    }) => {
      //setup wallet
      await extension.wallet.newWalletOnboarding()
      await extension.open()
      await extension.dapps.requestConnectionFromDapp({
        browserContext,
        useStarknetKitModal,
      })
      //accept connection from Argent X
      await extension.dapps.accept.click()
      //check connect dapps
      await extension.navigation.showSettingsLocator.click()
      await extension.settings.account(extension.account.accountName1).click()
      await extension.page
        .getByRole("button", { name: "Connected dapps" })
        .click()
      await expect(extension.dapps.connected()).toBeVisible()
      //disconnect dapp from Argent X
      await extension.dapps.disconnect().click()
      await expect(extension.dapps.connected()).toBeHidden()
      await extension.page
        .getByRole("button", { name: "Connected dapps" })
        .click()
      await expect(
        extension.page.getByRole("heading", { name: "No connected dapps" }),
      ).toBeVisible()
    })
  }
})
