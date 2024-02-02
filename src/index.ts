import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const version = core.getInput('otel-version')
    const distribution = core.getInput('otel-distribution')
    const architecture = core.getInput('architecture')
    if (version && distribution && architecture) {
      const toolPath = await getOtel(version, distribution, architecture)
      core.setOutput('otel-version', version)
      core.setOutput('otel-path', path.join(toolPath, distribution))
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function getOtel(
  version: string,
  distribution: string,
  architecture: string
): Promise<string> {
  let toolPath = tc.find('otel', `${distribution}-${version}`, architecture)

  core.setOutput('cache-hit', true)
  if (!toolPath) {
    core.setOutput('cache-hit', false)
    toolPath = await downloadOtel(version, distribution, architecture)
    await tc.cacheDir(
      toolPath,
      'otel',
      `${distribution}-${version}`,
      architecture
    )
  }

  core.addPath(toolPath)
  return toolPath
}

async function downloadOtel(
  version: string,
  distribution: string,
  architecture: string
): Promise<string> {
  const downloadUrl = `https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v${version}/${distribution}_${version}_linux_${architecture}.tar.gz`
  console.log(`Downloading ${downloadUrl}`)
  const downloadPath = await tc.downloadTool(downloadUrl)
  return await tc.extractTar(downloadPath)
}

run()
