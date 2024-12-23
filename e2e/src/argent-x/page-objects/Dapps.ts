import { ChromiumBrowserContext, Page, expect } from "@playwright/test"

import { lang } from "../languages"
import Navigation from "./Navigation"

const dappUrl = "http://localhost:3000"
const dappName = "localhost"
export default class Dapps extends Navigation {
  private dApp: Page
  constructor(page: Page) {
    super(page)
    this.dApp = page
  }

  account(accountName: string) {
    return this.page.locator(`[data-testid="${accountName}"]`).first()
  }

  connectedDapps(accountName: string, nbrConnectedDapps: number) {
    return nbrConnectedDapps > 1
      ? this.page.locator(
          `[data-testid="${accountName}"]:has-text("${nbrConnectedDapps} dapps connected")`,
        )
      : this.page.locator(
          `[data-testid="${accountName}"]:has-text("${nbrConnectedDapps} dapp connected")`,
        )
  }

  get noConnectedDapps() {
    return this.page.locator(
      `text=${lang.settings.account.authorisedDapps.noAuthorisedDapps}`,
    )
  }

  connected() {
    return this.page.locator(`//div/*[contains(text(),'${dappName}')]`)
  }

  disconnect() {
    return this.page.locator(
      `//div/*[contains(text(),'${dappName}')]/following::button[1]`,
    )
  }

  disconnectAll() {
    return this.page.locator(
      `p:text-is("${lang.settings.account.authorisedDapps.disconnectAll}")`,
    )
  }

  get accept() {
    return this.page.locator(
      `button:text-is("${lang.settings.account.authorisedDapps.connect}")`,
    )
  }

  get reject() {
    return this.page.locator(
      `button:text-is("${lang.settings.account.authorisedDapps.reject}")`,
    )
  }

  async requestConnectionFromDapp({
    browserContext,
    useStarknetKitModal = false,
  }: {
    browserContext: ChromiumBrowserContext
    useStarknetKitModal?: boolean
  }) {
    //open dapp page
    this.dApp = await browserContext.newPage()
    await this.dApp.setViewportSize({ width: 1080, height: 720 })
    await this.dApp.goto("chrome://inspect/#extensions")
    await this.dApp.waitForTimeout(1000)
    await this.dApp.goto(dappUrl)

    await this.dApp.getByRole("button", { name: "Connection" }).click()
    if (useStarknetKitModal) {
      await this.dApp.getByRole("button", { name: "Starknetkit Modal" }).click()
      await this.dApp
        .locator("#starknetkit-modal-container")
        .getByRole("button", { name: "Argent X" })
        .click()
    } else {
      await expect(
        this.dApp.locator('button :text-is("Argent X")'),
      ).toBeVisible()
    }

    await this.dApp.locator('button :text-is("Argent X")').click()
  }

  async sendERC20transaction({
    browserContext,
    type,
  }: {
    browserContext: ChromiumBrowserContext
    type: "ERC20" | "Multicall"
  }) {
    const [extension, dappPage] = browserContext.pages()
    const dialogPromise = this.dApp.waitForEvent("dialog")

    dappPage.bringToFront()

    // avoid too many requests in a short time, causing user to reject
    await this.dApp.waitForTimeout(2500)
    await this.dApp.locator('button :text-is("Transactions")').click()
    await this.dApp.waitForTimeout(2500)
    await this.dApp.locator(`button :text-is("Send ${type}")`).click()

    await expect(extension.getByText("Review transaction")).toBeVisible()
    await expect(extension.getByText("Confirm")).toBeVisible()
    const [, dialog] = await Promise.all([
      extension.getByText("Confirm").click(),
      dialogPromise,
    ])

    expect(dialog.message()).toContain("Transaction sent")
    await dialog.accept()
  }

  async signMessage({
    browserContext,
  }: {
    browserContext: ChromiumBrowserContext
  }) {
    const [extension, dappPage] = browserContext.pages()

    dappPage.bringToFront()

    await this.dApp.locator('button :text-is("Signing")').click()
    await this.dApp.locator("[name=short-text]").fill("some message to sign")
    await this.dApp.locator('button[type="submit"]').click()

    extension.bringToFront()
    await this.page.locator(`button:text-is("${lang.sign.accept}")`).click()
    dappPage.bringToFront()

    await Promise.all([
      expect(this.dApp.getByText("Signer", { exact: true })).toBeVisible(),
      expect(this.dApp.locator("[name=signer_r]")).toBeVisible(),
      expect(this.dApp.locator("[name=signer_s]")).toBeVisible(),
    ])
  }

  async network({
    browserContext,
    type,
  }: {
    browserContext: ChromiumBrowserContext
    type: "Add" | "Change"
  }) {
    const [extension, dappPage] = browserContext.pages()
    dappPage.bringToFront()
    await this.dApp.locator('button :text-is("Network")').click()
    await this.dApp.locator(`button :text-is("${type} Network")`).click()

    extension.bringToFront()
    await this.dApp.waitForTimeout(1000)
    await this.page
      .locator(
        `button:text-is("${type === "Add" ? lang.network.addNetwork : lang.network.switchNetwork}")`,
      )
      .click()

    if (type === "Change") {
      await this.accept.click()
    }
  }

  async addToken({
    browserContext,
  }: {
    browserContext: ChromiumBrowserContext
  }) {
    const [extension, dappPage] = browserContext.pages()
    dappPage.bringToFront()
    await this.dApp.locator('button :text-is("ERC20")').click()
    await this.dApp.locator(`button :text-is("Add Token")`).click()

    extension.bringToFront()
    await this.dApp.waitForTimeout(1000)
    await this.page.locator(`button:text-is("Add token")`).click()
  }
}
