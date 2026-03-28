const fs = require('fs')
const path = require('path')
const Module = require('module')
const ts = require('typescript')

const rootDir = path.resolve(__dirname, '..')
const originalTsLoader = require.extensions['.ts']

require.extensions['.ts'] = function registerTypeScript(module, filename) {
  const source = fs.readFileSync(filename, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
      allowJs: true,
    },
    fileName: filename,
  })

  module._compile(compiled.outputText, filename)
}

try {
  const { getSitemapAuditReport } = require(path.join(rootDir, 'lib', 'sitemap.ts'))
  const report = getSitemapAuditReport()
  const args = new Set(process.argv.slice(2))

  if (args.has('--json')) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(`total: ${report.totalCount}`)
    console.log(`core: ${report.countsByKind.core}`)
    console.log(`hub: ${report.countsByKind.hub}`)
    console.log(`community: ${report.countsByKind.community}`)
    console.log(`category: ${report.countsByKind.category}`)
    console.log(`guide: ${report.countsByKind.guide}`)
    console.log(`post: ${report.countsByKind.post}`)

    console.log('included hub pages:')
    for (const url of report.includedHubPages) {
      console.log(`- ${url}`)
    }

    console.log('excluded routes:')
    for (const route of report.excludedRoutes) {
      console.log(`- ${route}`)
    }

    if (report.duplicates.length > 0) {
      console.log('duplicates:')
      for (const url of report.duplicates) {
        console.log(`- ${url}`)
      }
    } else {
      console.log('duplicates: none')
    }

    if (report.unexpectedUrls.length > 0) {
      console.log('unexpected:')
      for (const issue of report.unexpectedUrls) {
        console.log(`- ${issue.url} :: ${issue.reason}`)
      }
    } else {
      console.log('unexpected: none')
    }

    if (report.missingExpectedUrls.length > 0) {
      console.log('missing:')
      for (const issue of report.missingExpectedUrls) {
        console.log(`- ${issue.url} :: ${issue.reason}`)
      }
    } else {
      console.log('missing: none')
    }

    if (args.has('--list')) {
      console.log('urls:')
      for (const url of report.urls) {
        console.log(url)
      }
    }
  }

  if (report.duplicates.length > 0 || report.unexpectedUrls.length > 0 || report.missingExpectedUrls.length > 0) {
    process.exitCode = 1
  }
} finally {
  if (originalTsLoader) {
    require.extensions['.ts'] = originalTsLoader
  } else {
    delete require.extensions['.ts']
  }
}
