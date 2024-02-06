import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const version = core.getInput('otel-version')
    const distribution = core.getInput('otel-distribution')
    const os = process.env.RUNNER_OS
    const architecture = process.env.RUNNER_ARCH
    if (version && distribution && os && architecture) {
      const toolPath = await getOtel(version, distribution, os, architecture)
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
  os: string,
  architecture: string
): Promise<string> {
  let toolPath = tc.find(
    'otel',
    `${distribution}-${version}-${os}`,
    architecture
  )

  core.setOutput('cache-hit', true)
  if (!toolPath) {
    core.setOutput('cache-hit', false)
    toolPath = await downloadOtel(version, distribution, os, architecture)
    await tc.cacheDir(
      toolPath,
      'otel',
      `${distribution}-${version}-${os}`,
      architecture
    )
  }

  core.addPath(toolPath)
  return toolPath
}

const os_mapping = new Map<string, string>([
  ['Linux', 'linux'],
  ['macOS', 'darwin'],
  ['Windows', 'windows']
])

const arch_mapping = new Map<string, string>([
  ['X86', '386'],
  ['X64', 'amd64'],
  ['ARM', 'armv7'],
  ['ARM64', 'arm64']
])

async function downloadOtel(
  version: string,
  distribution: string,
  os: string,
  architecture: string
): Promise<string> {
  const release_os = os_mapping.get(os) || 'linux'
  const release_arch = arch_mapping.get(architecture) || 'amd64'
  const downloadUrl = `https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v${version}/${distribution}_${version}_${release_os}_${release_arch}.tar.gz`
  console.log(`Downloading ${downloadUrl}`)
  const downloadPath = await tc.downloadTool(downloadUrl)
  return await tc.extractTar(downloadPath)
}

run()
