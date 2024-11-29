import { ChromiumBrowserContext, Page, expect } from "@playwright/test"

import { lang } from "../languages"
import Navigation from "./Navigation"
import config from "../../../config"

const dappUrl = "http://localhost:3000"
const dappName = 'localhost'
export default class Dapps extends Navigation {
  constructor(page: Page) {
    super(page)
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

  get knownDappButton() {
    return this.page.locator('[data-testid="KnownDappButton"]')
  }

  async ensureKnowDappText() {
    return Promise.all([
      expect(this.page.locator('h4:text-is("Known Dapp")')).toBeVisible(),
      expect(
        this.page.locator('p:text-is("This dapp is listed on Dappland")'),
      ).toBeVisible(),
    ])
  }
  async requestConnectionFromDapp(
    { browserContext,
      useStarknetKitModal = false }:
      {
        browserContext: ChromiumBrowserContext,
        useStarknetKitModal?: boolean
      }
  ) {
    //open dapp page
    const dapp = await browserContext.newPage()
    await dapp.setViewportSize({ width: 1080, height: 720 })
    await dapp.goto("chrome://inspect/#extensions")
    await dapp.waitForTimeout(1000)
    await dapp.goto(dappUrl)

    await dapp.getByRole('button', { name: 'Connection' }).click()
    if (useStarknetKitModal) {
      await dapp.getByRole('button', { name: 'Starknetkit Modal' }).click()
      await dapp.locator('#starknetkit-modal-container').getByRole('button', { name: 'Argent X Argent X' }).click()
    } else {
      await expect(dapp.locator('button :text-is("Argent X")')).toBeVisible()
    }
    await dapp.locator('button :text-is("Argent X")').click()
    return dapp
  }

  async claimSpok(browserContext: ChromiumBrowserContext) {
    const spokCampaignUrl = config.spokCampaignUrl! || ''
    //open dapp page
    const dapp = await browserContext.newPage()
    await dapp.setViewportSize({ width: 1080, height: 720 })
    await dapp.goto("chrome://inspect/#extensions")
    await dapp.waitForTimeout(1000)
    await dapp.goto(spokCampaignUrl)
    await dapp.getByRole("button", { name: "Check eligibility" }).click()
    await expect(dapp.locator("text=Argent X")).toBeVisible()
    await dapp.locator("text=Argent X").click()
    return dapp
  }

  checkCriticalRiskConnectionScreen() {
    return Promise.all([
      expect(
        this.page.locator(
          `//span[text()="Critical risk"]/following-sibling::label[text()="Use of a blacklisted domain"]`,
        ),
      ).toBeVisible(),
      expect(
        this.page.locator(
          `//p[@data-testid="review-footer" and text()="Please review warnings before continuing"]`,
        ),
      ).toBeVisible(),
      expect(this.page.getByRole("button", { name: "Connect" })).toBeDisabled(),
    ])
  }

  async acceptCriticalRiskConnection() {
    await this.page.getByRole("button", { name: "Review" }).click()
    await Promise.all([
      expect(
        this.page.locator(`//header[@title="1 risk identified"]`),
      ).toBeVisible(),
      expect(
        this.page.locator(
          '//label[text()="We strongly recommend you do not proceed with this transaction"]',
        ),
      ).toBeVisible(),
      expect(
        this.page.locator(
          '//span[text()="Critical risk"]/following-sibling::span[text()="Use of a blacklisted domain"]/following-sibling::p[text()="You are currently on an unsafe domain. Be aware of the risks."]',
        ),
      ).toBeVisible(),
    ])
    await this.page.getByRole("button", { name: "Accept risk" }).click()
  }

  async connectedDappsTooltip(dappUrl: string) {
    await this.showSettingsLocator.click()
    await this.page.hover('[data-testid="connected-dapp"]')
    await expect(
      this.page.locator('[data-testid="connected-dapp"]'),
    ).toHaveText(`Connected to ${dappUrl}`)
  }
}
