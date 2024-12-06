import { Page, expect } from "@playwright/test"
import { ICredentials } from "./Login"
import Navigation from "./Navigation"
import { artifactsDir } from "../../shared/cfg/test"
import { randomUUID } from "crypto"
import SapoEmailClient from "../../shared/src/SapoEmailClient"
import config from "../config"
const dappUrl = "http://localhost:3000/"
let mailClient: SapoEmailClient

export default class Dapps extends Navigation {
  constructor(page: Page) {
    super(page)
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
    await dApp.setViewportSize({ width: 1080, height: 720 })
    await dApp.goto(dappUrl)

    await dApp.getByRole("button", { name: "Connection" }).click()
    if (useStarknetKitModal) {
      await dApp.getByRole("button", { name: "Starknetkit Modal" }).click()
      const popup = await this.handlePopup(dApp, credentials, newAccount)
      await this.verifyEmailInPopup(popup, credentials.email)
      await popup.locator('button[type="submit"]').click()
    } else {
      const pagePromise = dApp.context().waitForEvent("page")
      await dApp.locator('button :text-is("Argent Web Wallet")').click()
      const newPage = await pagePromise
      await this.fillCredentials(newPage, credentials, newAccount)
    }

    return dApp
  }

  private async fillCredentials(
    page: Page,
    credentials: ICredentials,
    newAccount: boolean,
  ) {
    await page.locator("[name=email]").fill(credentials.email)
    await page.locator('button[type="submit"]').click()
    const pin = await mailClient.getPin()
    console.log("PIN:", pin)
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
    dApp: Page,
    credentials: ICredentials,
    newAccount: boolean,
  ) {
    const popupPromise = dApp.waitForEvent("popup")
    await expect(dApp.locator("p:text-is('Email')")).toBeVisible()
    await dApp.locator("p:text-is('Email')").click()
    const popup = await popupPromise
    // Wait for the popup to load.
    await popup.waitForLoadState()
    return this.fillCredentials(popup, credentials, newAccount)
  }

  private async verifyEmailInPopup(popup: Page, email: string) {
    await expect(popup.locator(`text="${email}"`))
      .toBeVisible()
      .catch(async () => {
        await popup.screenshot({ path: `${artifactsDir}/${randomUUID()}.png` })
        throw new Error("Email not visible")
      })
  }

  async sendERC20transaction({
    dapp,
    type,
  }: {
    dapp: Page
    type: "ERC20" | "Multicall"
  }) {
    const popupPromise = Promise.all([
      dapp.waitForEvent("popup"),
      dapp.frameLocator("iframe"),
    ])

    const dialogPromise = dapp.waitForEvent("dialog")
    console.log("Sending ERC20 transaction")
    await dapp.locator('button :text-is("Transactions")').click()
    await dapp.locator(`button :text-is("Send ${type}")`).click()
    console.log("Sending ERC20 transaction: send clicked")

    const [popup] = await popupPromise
    await expect(popup.getByText("Review transaction")).toBeVisible()
    console.log("Sending ERC20 transaction: review transaction visible")
    await expect(popup.getByText("Confirm")).toBeVisible()
    console.log("Sending ERC20 transaction: confirm visible")
    await popup.getByText("Confirm").click({ timeout: 30000, force: true })
    console.log("Sending ERC20 transaction: confirm clicked")
    //await popup.waitForEvent("close", { timeout: 10000 })

    console.log("Signing message: wait for dialog")
    const dialog = await dialogPromise
    expect(dialog.message()).toContain("Transaction sent")
    await dialog.accept()

    return dapp
  }

  async signMessage({ dapp }: { dapp: Page }) {
    console.log("Signing message")
    const popupPromise = Promise.all([
      dapp.waitForEvent("popup"),
      dapp.frameLocator("iframe"),
    ])
    await dapp.locator('button :text-is("Signing")').click()
    await dapp.locator("[name=short-text]").fill("some message to sign")
    await dapp.locator('button[type="submit"]').click()

    const [popup] = await popupPromise
    await expect(popup.getByText("Sign Message")).toBeVisible()
    console.log("Signing message: sign message visible")
    await expect(popup.getByText("Confirm")).toBeVisible()
    console.log("Signing message: confirm visible")
    await popup.getByText("Confirm").click({ timeout: 30000, force: true })
    console.log("Signing message: confirm clicked")
    //await popup.waitForEvent("close", { timeout: 10000 })

    console.log("Signing message: wait for ui")
    await expect(dapp.getByText("Signer", { exact: true })).toBeVisible()
    await expect(dapp.getByText("Cosigner", { exact: true })).toBeVisible()

    await expect(dapp.locator("[name=signer_r]")).toBeVisible()
    await expect(dapp.locator("[name=signer_s]")).toBeVisible()
    await expect(dapp.locator("[name=cosigner_r]")).toBeVisible()
    await expect(dapp.locator("[name=cosigner_s]")).toBeVisible()

    return dapp
  }
}
