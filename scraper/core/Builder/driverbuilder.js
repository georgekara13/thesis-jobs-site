const {Chrome}  = require('../Classes/Browser/Chrome/chrome')
const {Firefox} = require('../Classes/Browser/Firefox/firefox')

const driverBuilder = (browser, mode) => {
  switch (browser){
    case 'chrome':
      return new Chrome(mode)
      break
    case 'firefox':
      return new Firefox(mode)
      break
    default:
      return console.log('Unknown browser. Either use "firefox" or "chrome".\n')
  }
}

module.exports = { driverBuilder }
