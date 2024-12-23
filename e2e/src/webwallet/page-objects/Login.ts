import { Page, expect } from "@playwright/test"

import config from "../config"
import Navigation from "./Navigation"

export interface ICredentials {
  email: string
  pin: string
  password: string
}

export default class Login extends Navigation {
  constructor(page: Page) {
    super(page)
  }

  get email() {
    return this.page.locator("input[name=email]")
  }

  get pinInput() {
    return this.page.locator('[id^="pin-input"]')
  }

  get password() {
    return this.page.locator("input[name=password]")
  }
  get repeatPassword() {
    return this.page.locator("input[name=repeatPassword]")
  }
  get wrongPassword() {
    return this.page.locator(
      '//input[@name="password"][@aria-invalid="true"]/following::label[contains(text(), "Wrong password")]',
    )
  }

  get resendPin() {
    return this.page.getByText("Not received the email?")
  }

  get pinResendConfirmation() {
    return this.page.getByText("Email sent!")
  }

  get forgetPassword() {
    return this.page.getByText("Forgotten your password?")
  }

  get recoveryOptionsTitle() {
    return this.page.getByText("Recovery options")
  }

  get differentAccount() {
    return this.page.locator('p:text-is("Use a different account")')
  }

  async fillPin(pin: string) {
    await this.continue.click()
    await this.pinInput.first().click()
    await this.pinInput.first().fill(pin)
  }

  async success(credentials: ICredentials = config.validLogin) {
    await this.email.fill(credentials.email)
    await this.fillPin(credentials.pin)
    await this.password.fill(credentials.password)
    await expect(this.forgetPassword).toBeVisible()
    await expect(this.differentAccount).toBeVisible()
    await Promise.all([
      this.page.waitForURL(`${config.url}/settings`),
      this.continue.click(),
    ])
    await expect(this.lock).toBeVisible()
  }

  async createWallet(credentials: ICredentials) {
    await this.email.fill(credentials.email)
    //await this.continue.click()
    await this.fillPin(credentials.pin)
    await this.password.fill(credentials.password)
    await this.repeatPassword.fill(credentials.password)
    await Promise.all([
      this.page.waitForURL(`${config.url}/settings`),
      this.continue.click(),
    ])
    await expect(this.lock).toBeVisible()
  }
}
