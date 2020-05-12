const {readJSON}        = require('../Parser/readjson')
const {moduleValidator} = require('../Validate/modulevalidator')

class Conf {
  constructor(path){
    this._confPath      = path
    this._content       = readJSON(path)
    this._browser       = this.getContent().browser
    this._scraperConf   = this.getContent().scraper_conf
    this._scraperModule = moduleValidator(this.getContent().scraper_conf.use_module)
    this._scrapeType    = this.getContent().scrape_type
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

  getScraperConf(){
    return this._scraperConf
  }
  setScraperConf(scraperconf){
    this._scraperConf = scraperconf
  }

  getConfPath(){
    return this._confPath
  }

  getScrapeType(){
    return this._scrapeType
  }

  getScraperModule(){
    return this._scraperModule
  }
}

module.exports = { Conf }
