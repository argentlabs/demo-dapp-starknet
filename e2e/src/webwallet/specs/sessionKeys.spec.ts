import test from "../test"
import config from "../config"

test.describe(`Session Keys`, () => {
  test(`create a sessions, send a transaction a get EFO data`, async ({
    webWallet,
    dApp,
  }) => {
    await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: true,
    })

    await webWallet.dapps.sessionKeys()
  })
})
