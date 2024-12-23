import { downloadGitHubRelease, unzip } from "../../argent-x/utils"

export default async function downloadArgentXBuild() {
    if (process.env.DONWNLOAD_ARGENTX_BUILD) {
        console.log("Downloading ArgentX build")
        const version = await downloadGitHubRelease()
        const currentVersionDir = await unzip(version)
        process.env.ARGENTX_DIST_DIR = currentVersionDir
        console.log("ArgentX build downloaded:", version)
    } else {
        console.log("ArgentX build download skipped")
    }
}