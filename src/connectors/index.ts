import { ARGENT_WEBWALLET_URL, CHAIN_ID } from "@/constants"
import {
  isInArgentMobileAppBrowser,
  ArgentMobileConnector,
} from "starknetkit/argentMobile"
import {
  BraavosMobileConnector,
  isInBraavosMobileAppBrowser,
} from "starknetkit/braavosMobile"
import { Fordefi } from "starknetkit/fordefi"
import { MetaMask } from "starknetkit/metamask"
import { Braavos } from "starknetkit/braavos"
import { ArgentX } from "starknetkit/argentX"
import { Xverse } from "starknetkit/xverse"
import { WebWalletConnector } from "starknetkit/webwallet"
import { ControllerConnector } from "starknetkit/controller"
import { getStarknet } from "@starknet-io/get-starknet-core"

const isMobileDevice = () => {
  if (typeof window === "undefined") {
    return false
  }
  getStarknet()
  // Primary method: User Agent + Touch support check
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobileUA =
    /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent)
  const hasTouchSupport =
    "ontouchstart" in window || navigator.maxTouchPoints > 0

  // Backup method: Screen size
  const isSmallScreen = window.innerWidth <= 768

  // Combine checks: Must match user agent AND (touch support OR small screen)
  return isMobileUA && (hasTouchSupport || isSmallScreen)
}

export const availableConnectors = () => {
  if (isInArgentMobileAppBrowser()) {
    return [
      ArgentMobileConnector.init({
        options: {
          url: typeof window !== "undefined" ? window.location.href : "",
          dappName: "Example dapp",
          chainId: CHAIN_ID,
        },
      }),
    ]
  }

  if (isInBraavosMobileAppBrowser()) {
    return [BraavosMobileConnector.init({})]
  }

  return [
    new ArgentX(),
    new Braavos(),
    new MetaMask(),
    new Fordefi(),
    new Xverse(),
    new ControllerConnector(),
    ArgentMobileConnector.init({
      options: {
        url: typeof window !== "undefined" ? window.location.href : "",
        dappName: "Example dapp",
        chainId: CHAIN_ID,
      },
    }),
    isMobileDevice() ? BraavosMobileConnector.init({}) : null,
    new WebWalletConnector({ url: ARGENT_WEBWALLET_URL, theme: "dark" }),
  ].filter((connector) => connector !== null)
}

export const connectors = availableConnectors()
