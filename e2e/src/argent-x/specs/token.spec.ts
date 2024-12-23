import test from "../test"
import config from "../../../config"
import { expect } from "@playwright/test"

test.describe(`Token`, () => {

  test(`add a new token`, async ({ extension, browserContext }) => {
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

    await extension.dapps.addToken({
      browserContext,
    })

    await expect(extension.network.networkSelector).toBeVisible()
    await expect(
      extension.dapps.page.locator('[aria-label="Show account list"]'),
    ).toBeVisible()
  })
})
