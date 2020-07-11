const {moduleValidator} = require('../Validate/modulevalidator')

class Conf {
  constructor({name, browser, mode, module, url, totalAds, scrapeFrequency, scrapeType}){
    this._browser         = browser
    this._mode            = mode
    this._name            = name
    this._module          = moduleValidator(module)
    this._totalAds        = totalAds
    this._scrapeFrequency = scrapeFrequency
    this._url             = url
    this._scrapeType      = scrapeType
  }

  getBrowser(){
    return this._browser
  }
  setBrowser(browser){
    this._browser = browser
  }

  getMode(){
    return this._mode
  }

  getName(){
    return this._name
  }

  getModule(){
    return this._module
  }

  getUrl(){
    return this._url
  }

  getScrapeFrequency(){
    return this._scrapeFrequency
  }

  getTotalAds(){
    return this._totalAds
  }

  getScrapeType(){
    return this._scrapeType
  }
}

module.exports = { Conf }
