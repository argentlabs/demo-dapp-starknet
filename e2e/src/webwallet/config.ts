import path from "path"
import dotenv from "dotenv"
import fs from "fs"
import commonConfig from "../shared/config"

const envPath = path.resolve(__dirname, ".env")
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}
const config = {
  validLogin: {
    email: process.env.WW_EMAIL!,
    pin: process.env.WW_PIN!,
    password: process.env.WW_LOGIN_PASSWORD!,
  },
  emailPassword: process.env.EMAIL_PASSWORD!,
  acc_destination: commonConfig.destinationAddress! || '',
  vw_acc_addr: process.env.VW_ACC_ADDR! || '',
  url: "https://web.argent.xyz",
  ...commonConfig,
}

// check that no value of config is undefined, otherwise throw error
Object.entries(config).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`Missing ${key} config variable; check .env file`)
  }
})

export default config
