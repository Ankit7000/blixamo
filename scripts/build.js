const { spawnSync } = require('node:child_process')

const nextBin = require.resolve('next/dist/bin/next')
const result = spawnSync(process.execPath, [nextBin, 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
  },
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
