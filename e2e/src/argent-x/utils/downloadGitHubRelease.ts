import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import { pipeline } from "stream"
import { promisify } from "util"
import config from "../../../config"

const owner = config.migRepoOwner
const repo = config.migRepo
const streamPipeline = promisify(pipeline)

async function getLatestReleaseTag(): Promise<string> {
  console.log(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)

  try {
    // First try to get the latest release
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      {
        headers: {
          'User-Agent': 'GitHub Release Checker'
        }
      }
    );
    return response.data.tag_name;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // If no releases found, try getting tags instead
      const tagsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/tags`,
        {
          headers: {
            'User-Agent': 'GitHub Release Checker'
          }
        }
      );

      if (tagsResponse.data && tagsResponse.data.length > 0) {
        return tagsResponse.data[0].name;
      }
      throw new Error('No releases or tags found for this repository');
    }
    throw error;
  }
}


export async function downloadGitHubRelease(): Promise<string> {
  const tag = await getLatestReleaseTag();
  const version = tag.replace("v", "")
  const assetName = config.migReleaseName
  const token = config.migRepoToken
  const outputPath = `${config.migDir}${version}.zip`
  try {
    // Get release by tag name
    const releaseResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Node.js",
        },
      },
    )

    const releaseData = releaseResponse.data

    // Find the asset by name
    const asset = releaseData.assets.find((a: any) => a.name === assetName)

    if (!asset) {
      throw new Error(`Asset ${assetName} not found in release ${tag}`)
    }

    const assetUrl = asset.url

    // Download the asset
    const assetResponse = await axios.get(assetUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/octet-stream",
        "User-Agent": "Node.js",
      },
      responseType: "stream", // Important for streaming the response
    })

    // Ensure the output directory exists
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write the file
    await streamPipeline(assetResponse.data, fs.createWriteStream(outputPath))

    console.log(`Asset downloaded to ${outputPath}`)
  } catch (error: any) {
    console.error(`Error: ${error.message}`)
  }
  return version
}
