import test from "../test"
import config from "../../../config"
import { expect } from "@playwright/test"

test.describe(`Network`, () => {

  test(`add a new network`, async ({ extension, browserContext }) => {
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

    await extension.dapps.network({
      browserContext,
      type: "Add",
    })

    await expect(extension.network.networkSelector).toBeVisible()
    extension.network.openNetworkSelector()

    await expect(
      extension.network.page.locator(
        `button[role="menuitem"] span:text-is("ZORG")`,
      ),
    ).toBeVisible()
  })

  test(`switch network`, async ({ extension, browserContext }) => {
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

    await extension.dapps.network({
      browserContext,
      type: "Change",
    })

    await expect(extension.network.networkSelector).toBeVisible()

    const element = extension.network.page.locator(
      '[aria-label="Show account list"]',
    )

    const innerText = await element.evaluate((el) => el.textContent)
    expect(innerText).toContain("Mainnet")
  })
})
