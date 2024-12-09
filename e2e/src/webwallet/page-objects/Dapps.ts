import { Page, expect } from "@playwright/test"
import { ICredentials } from "./Login"
import Navigation from "./Navigation"
import SapoEmailClient from "../../shared/src/SapoEmailClient"
import config from "../config"
const dappUrl = "http://localhost:3000/"
let mailClient: SapoEmailClient

export default class Dapps extends Navigation {
  private dApp: Page
  constructor(page: Page) {
    super(page)
    this.dApp = page
    mailClient = new SapoEmailClient(
      config.validLogin.email,
      config.emailPassword,
    )
  }

  async requestConnectionFromDapp({
    dApp,
    credentials,
    newAccount = false,
    useStarknetKitModal = false,
  }: {
    dApp: Page
    credentials: ICredentials
    newAccount: boolean
    useStarknetKitModal?: boolean
  }) {
    this.dApp = dApp
    await dApp.setViewportSize({ width: 1080, height: 720 })
    await dApp.goto(dappUrl)

    await dApp.getByRole("button", { name: "Connection" }).click()
    if (useStarknetKitModal) {
      await Promise.all([
        dApp.getByRole("button", { name: "Starknetkit Modal" }).click(),
        this.handlePopup(credentials, newAccount)
      ])
    } else {
      const pagePromise = dApp.context().waitForEvent("page")
      await dApp.locator('button :text-is("Argent Web Wallet")').click()
      const newPage = await pagePromise
      await this.fillCredentials(newPage, credentials, newAccount)
    }

    this.dApp = dApp
  }

  private async fillCredentials(
    page: Page,
    credentials: ICredentials,
    newAccount: boolean,
  ) {
    await page.locator("[name=email]").fill(credentials.email)
    await page.locator('button[type="submit"]').click()
    const pin = await mailClient.getPin()
    await page.locator('[id^="pin-input"]').first().click()
    await page.locator('[id^="pin-input"]').first().fill(pin!)
    if (newAccount) {
      await page.locator("[name=password]").fill(credentials.password)
      await page.locator("[name=repeatPassword]").fill(credentials.password)
    } else {
      await page.locator("[name=password]").fill(credentials.password)
    }

    await page.locator('button[type="submit"]').click()

    await page.waitForLoadState()
    await page.locator('button[type="submit"]').click()

    return page
  }

  private async handlePopup(

    credentials: ICredentials,
    newAccount: boolean,
  ) {
    const popupPromise = this.dApp.waitForEvent("popup")
    await expect(this.dApp.locator("p:text-is('Email')")).toBeVisible()
    await this.dApp.locator("p:text-is('Email')").click()
    const popup = await popupPromise
    // Wait for the popup to load.
    await popup.waitForLoadState()
    return this.fillCredentials(popup, credentials, newAccount)
  }

  async sendERC20transaction({
    type,
  }: {
    type: "ERC20" | "Multicall"
  }) {
    const popupPromise = this.dApp.waitForEvent("popup")
    const dialogPromise = this.dApp.waitForEvent("dialog")
    console.log("Sending ERC20 transaction")
    await this.dApp.locator('button :text-is("Transactions")').click()
    const [_, popup] = await Promise.all([
      this.dApp.locator(`button :text-is("Send ${type}")`).click(),
      popupPromise
    ])
    console.log("Sending ERC20 transaction: send clicked")

    await expect(popup.getByText("Review transaction")).toBeVisible()
    console.log("Sending ERC20 transaction: review transaction visible")
    await expect(popup.getByText("Confirm")).toBeVisible()
    console.log("Sending ERC20 transaction: confirm visible")
    const [__, dialog] = await Promise.all([
      popup.getByText("Confirm").click(),
      dialogPromise
    ])
    console.log("Sending ERC20 transaction: confirm clicked")

    console.log("Signing message: wait for dialog")
    expect(dialog.message()).toContain("Transaction sent")
    await dialog.accept()

  }

  async signMessage() {
    console.log("Signing message")
    const popupPromise = this.dApp.waitForEvent("popup")
    await this.dApp.locator('button :text-is("Signing")').click()
    await this.dApp.locator("[name=short-text]").fill("some message to sign")
    const [_, popup] = await Promise.all([
      this.dApp.locator('button[type="submit"]').click(),
      popupPromise
    ])

    await expect(popup.getByText("Sign Message")).toBeVisible()
    console.log("Signing message: sign message visible")
    await expect(popup.getByText("Confirm")).toBeVisible()
    console.log("Signing message: confirm visible")
    await popup.getByText("Confirm").click({ timeout: 30000, force: true })
    console.log("Signing message: confirm clicked")
    //await popup.waitForEvent("close", { timeout: 10000 })

    console.log("Signing message: wait for ui")
    await Promise.all([
      expect(this.dApp.getByText("Signer", { exact: true })).toBeVisible(),
      expect(this.dApp.getByText("Cosigner", { exact: true })).toBeVisible(),
      expect(this.dApp.locator("[name=signer_r]")).toBeVisible(),
      expect(this.dApp.locator("[name=signer_s]")).toBeVisible(),
      expect(this.dApp.locator("[name=cosigner_r]")).toBeVisible(),
      expect(this.dApp.locator("[name=cosigner_s]")).toBeVisible(),
    ])
  }
}
