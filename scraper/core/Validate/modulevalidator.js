const fs = require('fs')
const { logger } = require('../../configuration/environment/logger')

const moduleValidator = (modulepath) => {
  if (!modulepath || !modulepath.match(/\.\/functions\/.*?\.js$/)) {
    logger.error(
      'Module to be used not defined properly in json file. Make sure you use this declaration: ./functions/FileName.js'
    )
    return
  } else if (!fs.existsSync(modulepath)) {
    logger.error(`Module '${modulepath}' does not exist`)
    return
  } else {
    logger.info(`Using module: '${modulepath}'`)
    return modulepath
  }
}

module.exports = { moduleValidator }
