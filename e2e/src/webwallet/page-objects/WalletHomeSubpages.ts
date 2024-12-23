import type { Page } from "@playwright/test"
import email from '../config';

export default class WalletHomeSubpages {
  page: Page
  constructor(page: Page) {
    this.page = page
  }  

  // Define the locators for the elements on the Wallet subpage: Portfolio
  get portfolioHeading() {
    return this.page.locator('text-is("Portfolio")');
  }

  get portfolioSubTitle() {
    return this.page.locator('text="Theh best place to track your portfolio on Starknet"');
  }

  // Define the locators for the elements on the Wallet subpage: Authorized dapps
  get authorizedDappsHeading() {
    return this.page.locator('h1:text-is("Authorized dapps")')
  }
  get goBackButton() {
    return this.page.locator(`button[aria-label="Go back"]`);
  }

  get connectedDappsTab() {
    return this.page.locator('tab:text-is("Connected dapps")');
  }

  get noConnectedDappsMessage() {
    return this.page.locator('text="No connected dapps"');
  }

  get activeSessionsTab() {
    return this.page.locator('text="Active sessions"');
  }

  get noActiveSessionsMessage() {
    return this.page.locator('text="No active sessions"');
  }

  //Define the locators for the elements on the Wallet subpage: Change password

  get changePasswordHeading() {
    return this.page.locator('h1:text-is("Change password")')
  }
  
  get enterCodeMessage() {
    return this.page.locator(`text="Enter the code we sent to" ${email}`);
  }

  get changePasswordDescription() {
    return this.page.locator(`text="We've sent you an email with a code. Enter it below so you can change your password."`)
  }

  get enterNewPasswordParagraph() {
    return this.page.locator('text="Enter new password"');
  }

  get passwordInput() {
    return this.page.locator('input[name="password"]');
  }

  get repeatNewPasswordParagraph() {
    return this.page.locator('text="Repeat new password"');
  }

  get repeatPasswordInput() {
    return this.page.locator('input[name="repeatPassword"]');
  }

  get continueButton() {
    return this.page.locator('button:text-is("Continue")');
  }

  get passwordChangedHeading() {
    return this.page.locator('element[name="Password successfully changed."]');
  }

  get goBackToSettingsButton() {
    return this.page.locator('button[name="Go back to settings"]');
  }

  // Define the locators for the elements on the Wallet subpage: Download private key
  get securityCompromisedHeading() {
    return this.page.locator('h1:text-is("Security of your wallet might get compromised")')
  }

  get securityCompromisedParagraph() {
    return this.page.locator('p:text-is("We strongly recommend to not download your private key if you\'re not sure what it means")')
  }

  get downloadKeyButton() {
    return this.page.locator('button:text-is("Download private key")')
  }

  get closeButton() {
    return this.page.locator('button:text-is("Close")')
  }

  // Define the locators for the elements on the Wallet subpage: Lock account
  get welcomeBackHeading() {
    return this.page.locator('h1:text-is("Welcome Back")');
  }

  get emailAddressHeading() {
    return this.page.locator(`text=${email}`);
  }
  
  get enterYourPasswordHeading() {
    return this.page.locator('h1:text-is("Enter your password")');
  }

  // Define the locators for the elements on Terms of service and Privacy policy Pages (outside WebWallet)
  get argentAppTermsOfServiceHeading() {
    return this.page.locator('h1:text-is("Argent App - Terms of Service")')
  }

  get argentAppPrivacyPolicyHeading() {
    return this.page.locator('h1:text-is("Argent App - Privacy Policy")')
  }

}
