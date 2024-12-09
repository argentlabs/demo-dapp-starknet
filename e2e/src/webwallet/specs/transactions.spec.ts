import test from "../test"
import config from "../config"

test.describe(`Transactions`, () => {
  test(`send an ERC20 from testDapp`, async ({ webWallet, dApp }) => {
    await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: true,
    })

    await webWallet.dapps.sendERC20transaction({
      type: "ERC20",
    })
  })

  test(`send an Multicall from testDapp`, async ({ webWallet, dApp }) => {
   await webWallet.dapps.requestConnectionFromDapp({
      dApp,
      credentials: config.validLogin,
      newAccount: false,
      useStarknetKitModal: true,
    })

    await webWallet.dapps.sendERC20transaction({
      type: "Multicall",
    })
  })
})
