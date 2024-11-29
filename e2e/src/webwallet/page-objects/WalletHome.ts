import type { Page } from "@playwright/test"
import email from '../config';

export default class WalletHome {
  page: Page
  constructor(page: Page) {
    this.page = page
  }  

  get webWalletTitle() {
    return this.page.locator(`p:text-is("${email}")`)
  }

  get viewInPortfolio() {
    return this.page.locator('p:text-is("View your smart account")')
  }

  get viewInPortfolioParagraph() {
    return this.page.locator('p:text-is("See your smart account on Argent Web.")')
  }

  get authorizedDapps() {
    return this.page.locator('p:text-is("Authorized dapps")')
  }

  get manageDappsParagraph() {
    return this.page.locator('p:text-is("Manage dapps connected with your account.")')
  }

  get passwordInput() {
    return this.page.locator('input[type="password"]')
  }

  get changePasswordParagraph() {
    return this.page.locator('p:text-is("Change password for your smart account.")')
  }

  get downloadPrivateKeyButton() {
    return this.page.locator('button:text-is("Download private key")')
  }

  get downloadButton() {
    return this.page.locator('button:text-is("Download")')
  }

  get lockAccountParagraph() {
    return this.page.locator('p:text-is("Lock your account.")')
  }

  get lockButton() {
    return this.page.locator('button:text-is("Lock")')
  }

  get termsOfServiceParagraph() {
    return this.page.locator('p:text-is("Terms of service")')
  }

  get privacyPolicyParagraph() {
    return this.page.locator('p:text-is("Privacy policy")')
  }

  get versionParagraph() {
    return this.page.locator('p:text-is("Version")')
  }


  async verifyLayout() {
    const elements = [
      this.webWalletTitle,
      this.viewInPortfolio,
      this.viewInPortfolioParagraph,
      this.authorizedDapps,
      this.manageDappsParagraph,
      this.passwordInput,
      this.changePasswordParagraph,
      this.downloadPrivateKeyButton,
      this.downloadButton,
      this.lockAccountParagraph,
      this.lockButton,
      this.termsOfServiceParagraph,
      this.privacyPolicyParagraph
    ];

    for (const element of elements) {
      await element.isVisible();
    }
  }


}
