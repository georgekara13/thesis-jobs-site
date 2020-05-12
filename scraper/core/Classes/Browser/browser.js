class Browser {
    constructor(mode) {
        this._name           = 'Default Browser'
        this._mode           = mode
        this._browserOptions
    }

    getName() {
        return this._name
    }

    getMode() {
        return this._mode
    }

    getBrowserOptions() {
        return this._browserOptions
    }

    getDriver() {
        return this._driver
    }

    setBrowserOptions(options) {
        this._browserOptions = options
    }

    browserBuilder() {
      //must be overriden
    }
}

module.exports = {Browser}
