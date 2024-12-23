import type { Page } from "@playwright/test"

export default class Navigation {
  page: Page
  constructor(page: Page) {
    this.page = page
  }

  get viewYourAccountTitle() {
    return this.page.locator("text=View your smart account")
  }

  get viewYourAccountDescription() {
    return this.page.locator("text=See your smart account on Argent Web.")
  }

  get continue() {
    return this.page.locator(`button:text-is("Continue")`)
  }

  get addFunds() {
    return this.page.getByRole("link", { name: "Add funds" })
  }

  get send() {
    return this.page.getByRole("link", { name: "Send" })
  }

  get authorizedDapps() {
    return this.page.getByRole("link", { name: "Authorized dapps" })
  }

  get changePassword() {
    return this.page.getByRole("link", { name: "Change password" })
  }

  get lock() {
    return this.page.getByRole("button", { name: "Lock" })
  }

  get switchTheme() {
    return this.page.getByRole("button", { name: "Switch theme" })
  }
}
