const firefox     = require('selenium-webdriver/firefox')
const webdriver   = require('selenium-webdriver')
const geckodriver = require('geckodriver')
const {Browser}   = require('../browser')

class Firefox extends Browser {
    constructor(mode) {
        super(mode)
        this._name           = 'Mozilla Firefox'
        this._mode           = mode
        this._browserOptions = new firefox.Options()
        this.browserBuilder()
    }

    browserBuilder() {
        if ( this.getMode() === 'headless' ){
            this.setBrowserOptions(this.getBrowserOptions().headless())
        }

        const driver = new webdriver.Builder()
                                  .forBrowser('firefox')
                                  .setFirefoxOptions(this.getBrowserOptions())
                                  .build()
        this._driver = driver
    }
}

module.exports = {Firefox}
