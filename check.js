import { Octokit } from '@octokit/action'
import 'zx/globals'

/**
 * repo: status-check-demo
 * owner: smalldecline
 */

const octokit = new Octokit()

const mainBranch = 'main'
const currentBranch = (await $`git rev-parse --abbrev-ref HEAD`).stdout.replace(
  '\n',
  ''
)

const check = async () => {
  // read content.md
  const content = await fs.readFile('content.md', 'utf8')

  // check if content start with h1
  const startWithHeader = content.startsWith('# ')

  return startWithHeader
}

// create pending status check to current commit
await octokit.rest.checks.create({
  owner: 'smalldecline',
  repo: 'status-check-demo',
  name: 'header-check',
  head_sha: currentBranch,
  status: 'in_progress',
})

// // run check
const result = await check()

if (result) {
  // create fail status check to current commit
  await octokit.rest.checks.create({
    owner: 'smalldecline',
    repo: 'status-check-demo',
    name: 'header-check',
    head_sha: currentBranch,
    status: 'completed',
    conclusion: 'failure',
    output: {
      title: 'Header Check',
      summary: 'Content must start with h1',
    },
  })
} else {
  // create success status check to current commit
  await octokit.rest.checks.create({
    owner: 'smalldecline',
    repo: 'status-check-demo',
    name: 'header-check',
    head_sha: currentBranch,
    status: 'completed',
    conclusion: 'success',
  })
}
