import { Octokit } from '@octokit/action'
import 'zx/globals'

$.verbose = false

/**
 * repo: status-check-demo
 * owner: smalldecline
 */

const octokit = new Octokit()

const headSha = (await $`git rev-parse HEAD`).stdout.replace('\n', '')

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
  head_sha: headSha,
  status: 'in_progress',
})

// // run check
const result = await check()

console.log('result', result)

if (result === false) {
  // create fail status check to current commit
  await octokit.rest.checks.create({
    owner: 'smalldecline',
    repo: 'status-check-demo',
    name: 'header-check',
    head_sha: headSha,
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
    head_sha: headSha,
    status: 'completed',
    conclusion: 'success',
    output: {
      title: 'Header Check',
      summary: 'Content start with h1',
    },
  })
}
