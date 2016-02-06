'use strict'

const fs = require('fs')
const path = require('path')
const program = require('commander')
const Formatter = require('./libs/formatter')

program
  .usage('<packageJsonPath> [options]')
  .version(require('./package.json').version)
  .option('--validate', 'Only validate package.json')
  .option('-O --output <path>', 'Output package.json path')
  .action((packageJsonPath) => {
    const formatter = new Formatter(packageJsonPath)
    if (program.validate) {
      if (!formatter.validator()) {
        console.error(formatter.messages.join('\n'))
        process.exit(1)
      }
      return
    }
    formatter.deleteUnsupportedKey()
    formatter.deleteUnsupportedProps()
    if (formatter.unSupportedKeys.length > 0) {
      console.error(formatter.unSupportedKeys.join('\n'))
      process.exit(1)
    } else if (program.output) {
      try {
        fs.writeFileSync(path.resolve(program.output), JSON.stringify(formatter.json, null, 2))
      } catch (e) {
        console.error(e)
        process.exit(1)
      }
    } else {
      console.log(JSON.stringify(formatter.json, null, 2))
    }
  })
program.parse(process.argv)
if (!program.args.length) {
  program.help()
}
