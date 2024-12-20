import test from "../test"
import config from "../config"

test.describe(`Connect`, () => {
  test(`connect from testDapp using starknetKitModal`, async ({
    webWallet,
    dApp,
  }) => {
    await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: true,
    })
  })

  test(`connect from testDapp using webwallet connector`, async ({
    webWallet,
    dApp,
  }) => {
    await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: false,
    })
  })
})
