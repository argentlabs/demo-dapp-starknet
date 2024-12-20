import test from "../test"
import config from "../config"

test.describe(`Token`, () => {
  test(`not implemented while calling Add Token`, async ({
    webWallet,
    dApp,
  }) => {
    await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: true,
    })

    await webWallet.dapps.addToken()
  })
})
