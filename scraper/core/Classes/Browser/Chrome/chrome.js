const chrome       = require('selenium-webdriver/chrome')
const webdriver    = require('selenium-webdriver')
const chromedriver = require('chromedriver')
const {Browser}    = require('../browser')

class Chrome extends Browser {
    constructor(mode) {
        super(mode)
        this._name           = 'Google Chrome'
        this._mode           = mode
        this._browserOptions = new chrome.Options()
        this.browserBuilder()
    }

    browserBuilder() {
      if ( this.getMode() === 'headless' ){
        this.setBrowserOptions(this.getBrowserOptions().headless())
      }
      const driver = new webdriver.Builder()
                                  .forBrowser('chrome')
                                  .setChromeOptions(this.getBrowserOptions())
                                  .build()
      this._driver = driver
    }
}

module.exports = {Chrome}
