import test from "../test"
import config from "../config"

test.describe(`Network`, () => {
  test(`not implemented while calling Add Network`, async ({
    webWallet,
    dApp,
  }) => {
    await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: true,
    })

    await webWallet.dapps.network({
      type: "Add",
    })
  })

  test(`not implemented while calling Change Network`, async ({
    webWallet,
    dApp,
  }) => {
    await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: false,
    })

    await webWallet.dapps.network({
      type: "Change",
    })
  })
})
