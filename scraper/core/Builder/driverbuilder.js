const { Chrome } = require('../Classes/Browser/Chrome/chrome')
const { Firefox } = require('../Classes/Browser/Firefox/firefox')
const { logger } = require('../../configuration/environment/logger')

const driverBuilder = (browser, mode) => {
  switch (browser) {
    case 'chrome':
      return new Chrome(mode)
    case 'firefox':
      return new Firefox(mode)
    default:
      logger.warn('Unknown browser. Falling back to "firefox"')
      return new Firefox(mode)
  }
}

module.exports = { driverBuilder }
