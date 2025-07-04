import { expect } from "@playwright/test"

import test from "../test"
import config from "../../../config"

test.describe("Connect", () => {
  for (const useStarknetKitModal of [true, false] as const) {
    test(`connect from testDapp using starknetKitModal ${useStarknetKitModal}`, async ({
      extension,
      browserContext,
    }) => {
      //setup wallet
      await extension.open()
      await extension.recoverWallet(config.testSeed3!)
      await expect(extension.network.networkSelector).toBeVisible()
      await extension.network.selectDefaultNetwork()

      await extension.dapps.requestConnectionFromDapp({
        browserContext,
        useStarknetKitModal,
      })

      //accept connection from Ready
      await extension.dapps.accept.click()
      //check connect dapps
      await extension.navigation.showSettingsLocator.click()
      await extension.settings.account(extension.account.accountName1).click()
      await extension.page
        // .locator(`//a//*[text()="Authorized dapps"]`)
        .getByRole("button", { name: "Connected dapps" })
        .click()

      await expect(extension.dapps.connected()).toBeVisible()
      //disconnect dapp from Ready
      await extension.dapps.disconnect().click()
      await expect(extension.dapps.connected()).toBeHidden()

      await expect(
        extension.page.getByRole("heading", { name: "No authorized dapps" }),
      ).toBeVisible()
    })
  }
})
