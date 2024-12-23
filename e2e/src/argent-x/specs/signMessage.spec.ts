import { expect } from "@playwright/test"

import test from "../test"
import config from "../../../config"

test.describe("Sign message", () => {

  test(`sign a message from testDapp`, async ({
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
      useStarknetKitModal: true,
    })
    //accept connection from Argent X
    await extension.dapps.accept.click()

    await extension.dapps.signMessage({
      browserContext,
    })
  })
})
