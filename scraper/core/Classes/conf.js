const {readJSON}        = require('../Parser/readjson')
const {moduleValidator} = require('../Validate/modulevalidator')

class Conf {
  constructor(path){
    this._confPath        = path
    this._content         = readJSON(path)
    this._browser         = this.getContent().browser
    this._mode            = this.getContent().mode
    this._name            = this.getContent().name
    this._module          = moduleValidator(this.getContent().module)
    this._totalAds        = this.getContent().totalAds
    this._scrapeFrequency = this.getContent().scrapeFrequency
    this._url             = this.getContent().url
    this._scrapeType      = this.getContent().scrapeType
  }

  getContent(){
    return this._content
  }
  setContent(content){
    this._content = content
  }

  getBrowser(){
    return this._browser
  }
  setBrowser(browser){
    this._browser = browser
  }

  getConfPath(){
    return this._confPath
  }

  getModule(){
    return this._module
  }

  getScrapeType(){
    return this._scrapeType
  }
}

module.exports = { Conf }
