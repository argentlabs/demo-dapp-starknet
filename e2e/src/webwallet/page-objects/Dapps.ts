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
        this.handlePopup(credentials, newAccount),
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
    popup: Page,
    credentials: ICredentials,
    newAccount: boolean,
  ) {
    await popup.locator("[name=email]").fill(credentials.email)
    await popup.locator('button[type="submit"]').click()
    const pin = await mailClient.getPin()
    await popup.locator('[id^="pin-input"]').first().click()
    await popup.locator('[id^="pin-input"]').first().fill(pin!)
    if (newAccount) {
      await popup.locator("[name=password]").fill(credentials.password)
      await popup.locator("[name=repeatPassword]").fill(credentials.password)
    } else {
      await popup.locator("[name=password]").fill(credentials.password)
    }

    // password submit
    await popup.locator('button[type="submit"]').click()

    await Promise.all([
      popup.waitForURL("**/connect?**"),
      popup.waitForTimeout(5000), // additional safety delay if needed
    ])

    const allButtons = popup.locator("button")
    const count = await allButtons.count()

    // check if connect page is showed by checking buttons
    if (count > 0) {
      await popup.locator('button[type="submit"]').click()
    }

    return popup
  }

  private async handlePopup(credentials: ICredentials, newAccount: boolean) {
    const popupPromise = this.dApp.waitForEvent("popup")
    await expect(this.dApp.locator("p:text-is('Email')")).toBeVisible()
    await this.dApp.locator("p:text-is('Email')").click()
    const popup = await popupPromise
    // Wait for the popup to load.
    await popup.waitForLoadState()
    return this.fillCredentials(popup, credentials, newAccount)
  }

  async sendERC20transaction({ type }: { type: "ERC20" | "Multicall" }) {
    const popupPromise = this.dApp.waitForEvent("popup")
    const dialogPromise = this.dApp.waitForEvent("dialog")
    await this.dApp.locator('button :text-is("Transactions")').click()
    const [, popup] = await Promise.all([
      this.dApp.locator(`button :text-is("Send ${type}")`).click(),
      popupPromise,
    ])

    await expect(popup.getByText("Review transaction")).toBeVisible()
    await expect(popup.getByText("Confirm")).toBeVisible()
    const [, dialog] = await Promise.all([
      popup.getByText("Confirm").click(),
      dialogPromise,
    ])

    expect(dialog.message()).toContain("Transaction sent")
    await dialog.accept()
  }

  async signMessage() {
    const popupPromise = this.dApp.waitForEvent("popup")
    await this.dApp.locator('button :text-is("Signing")').click()
    await this.dApp.locator("[name=short-text]").fill("some message to sign")
    const [, popup] = await Promise.all([
      this.dApp.locator('button[type="submit"]').click(),
      popupPromise,
    ])

    await expect(popup.getByText("Sign Message")).toBeVisible()
    await expect(popup.getByText("Confirm")).toBeVisible()
    await popup.getByText("Confirm").click({ timeout: 3000, force: true })

    await Promise.all([
      expect(this.dApp.getByText("Signer", { exact: true })).toBeVisible(),
      expect(this.dApp.getByText("Cosigner", { exact: true })).toBeVisible(),
      expect(this.dApp.locator("[name=signer_r]")).toBeVisible(),
      expect(this.dApp.locator("[name=signer_s]")).toBeVisible(),
      expect(this.dApp.locator("[name=cosigner_r]")).toBeVisible(),
      expect(this.dApp.locator("[name=cosigner_s]")).toBeVisible(),
    ])
  }

  async network({ type }: { type: "Add" | "Change" }) {
    const dialogPromise = this.dApp.waitForEvent("dialog")
    await this.dApp.locator('button :text-is("Network")').click()
    await this.dApp.locator(`button :text-is("${type} Network")`).click()
    const dialog = await dialogPromise
    expect(dialog.message()).toContain("Not implemented")
    await dialog.accept()
  }

  async addToken() {
    const dialogPromise = this.dApp.waitForEvent("dialog")
    await this.dApp.locator('button :text-is("ERC20")').click()
    await this.dApp.locator(`button :text-is("Add Token")`).click()
    const dialog = await dialogPromise
    expect(dialog.message()).toContain("Not implemented")
    await dialog.accept()
  }

  async sessionKeys() {
    const popupPromise = this.dApp.waitForEvent("popup")

    await this.dApp.locator('button :text-is("Session Keys")').click()
    await expect(
      this.dApp.locator(`button :text-is("Create session")`),
    ).toBeVisible()
    await this.dApp.waitForTimeout(100)
    const [, popup] = await Promise.all([
      this.dApp.locator(`button :text-is("Create session")`).click(),
      popupPromise,
    ])

    await popup
      .getByRole("button")
      .and(popup.getByText("Start session"))
      .click()
    await this.dApp.waitForTimeout(1000)

    const dialogPromise = this.dApp.waitForEvent("dialog")
    const [, dialog] = await Promise.all([
      this.dApp.getByText("Submit session tx").click(),
      dialogPromise,
    ])

    expect(dialog.message()).toContain("Transaction sent")
    await dialog.accept()

    await this.dApp.waitForTimeout(500)
    await this.dApp.getByText("Submit EFO call").click()
    const dialogPromiseEFO = this.dApp.waitForEvent("dialog")
    await this.dApp.waitForTimeout(100)
    this.dApp.getByText("Copy EFO call").click()
    const dialogEFO = await dialogPromiseEFO
    await this.dApp.waitForTimeout(500)
    expect(dialogEFO.message()).toContain("Data copied in your clipboard")
    await dialogEFO.accept()

    await this.dApp.getByText("Submit EFO TypedData").click()
    const dialogPromiseEFOTypedData = this.dApp.waitForEvent("dialog")
    await this.dApp.waitForTimeout(100)
    this.dApp.getByText("Copy EFO TypedData").click()
    const dialogEFOTypedData = await dialogPromiseEFOTypedData
    await this.dApp.waitForTimeout(500)
    expect(dialogEFOTypedData.message()).toContain(
      "Data copied in your clipboard",
    )
    await dialogEFOTypedData.accept()
  }
}
