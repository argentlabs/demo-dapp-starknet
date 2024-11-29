import test from "../test"
import config from "../config"

test.describe(`Dapps`, () => {
  for (const useStarknetKitModal of [true, false] as const) {
    test(`connect from testDapp using starknetKitModal ${useStarknetKitModal}`, async ({ webWallet, dApp }) => {
      await webWallet.dapps.requestConnectionFromDapp({
        dApp,
        credentials: config.validLogin,
        newAccount: false,
        useStarknetKitModal
      })
    })
  }
})
