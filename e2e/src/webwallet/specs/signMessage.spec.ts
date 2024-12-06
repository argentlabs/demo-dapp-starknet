import test from "../test"
import config from "../config"

test.describe(`Sign message`, () => {
  test(`sign a message from testDapp`, async ({ webWallet, dApp }) => {
    const dapp = await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: true,
    })

    await webWallet.dapps.signMessage({
      dapp,
    })
  })
})
