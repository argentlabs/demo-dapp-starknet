import { Page, expect } from "@playwright/test"
import { ICredentials } from "./Login"
import Navigation from "./Navigation"
import { artifactsDir } from "../../shared/cfg/test"
import { randomUUID } from "crypto"
import SapoEmailClient from "../../shared/src/SapoEmailClient"
import config from "../config"
const dappUrl = 'http://localhost:3000/'
let mailClient: SapoEmailClient

export default class Dapps extends Navigation {
  constructor(page: Page) {
    super(page)
    mailClient = new SapoEmailClient(config.validLogin.email, config.emailPassword);
  }

  async requestConnectionFromDapp({
    dApp,
    credentials,
    newAccount = false,
    useStarknetKitModal = false
  }: {
    dApp: Page
    credentials: ICredentials
    newAccount: boolean
    useStarknetKitModal?: boolean
  }) {

    await dApp.setViewportSize({ width: 1080, height: 720 })
    await dApp.goto(dappUrl)

    await dApp.getByRole('button', { name: 'Connection' }).click()
    if (useStarknetKitModal) {
      await dApp.getByRole('button', { name: 'Starknetkit Modal' }).click()
      const popup = await this.handlePopup(dApp, credentials, newAccount)
      await this.verifyEmailInPopup(popup, credentials.email)
      await popup.locator('button[type="submit"]').click()
    } else {
      const pagePromise = dApp.context().waitForEvent('page');
      await dApp.locator('button :text-is("Argent Web Wallet")').click();
      const newPage = await pagePromise;
      await this.fillCredentials(newPage, credentials, newAccount)
    }
    return dApp
  }

  private async fillCredentials(page: Page, credentials: ICredentials, newAccount: boolean) {
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
    return page
  }

  private async handlePopup(dApp: Page, credentials: ICredentials, newAccount: boolean) {
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
}
