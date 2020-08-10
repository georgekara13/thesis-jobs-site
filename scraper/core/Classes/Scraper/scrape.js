const {exportJSON} = require('../../Parser/readjson')
const {Date}       = require('../date')
const axios        = require('axios')
const scraperConf  = require('../../../configuration/environment/scraperconf').scraperConf()
const {logger}     = require('../../../configuration/environment/logger')


class Scrape {
  constructor(Conf, Driver){
    this._conf         = Conf
    this._driver       = Driver
    this._totalads     = 0
    this._scrapetime   = 0
    this._adstatistics = {}
    this._adurls       = []
    this._adfields     = {
      title:"",
      description:"",
      location:"",
      salaryMin:"",
      salaryMax:"",
      company:"",
      jobTag:[],
      contactPhone:"",
      contactEmail:"",
      url:""
    }
  }

  getConf(){
    return this._conf
  }

  getDriver(){
    return this._driver
  }

  getTotalAds(){
    return this._totalads
  }
  setTotalAds(totalads){
    this._totalads = totalads
  }

  getScrapeTime(){
    return this._scrapetime
  }
  setScrapeTime(scrapetime){
    this._scrapetime = scrapetime
  }

  getAdUrls(){
    return this._adurls
  }
  setAdUrls(adurls){
    this._adurls = adurls
  }

  getAdStatistics(){
    return this._adstatistics
  }
  setAdStatistics(adstatistics){
    this._adstatistics = adstatistics
  }

  getAdFields(){
    return this._adfields
  }

  indexAd(ads){
    if (ads.length !== 0) {
      axios.post(`${scraperConf.HOST}/api/addjobs`, ads)
           .then(response => {
                  console.log(response.data)
                  logger.info(JSON.stringify(response.data))
                })
    }
    else {
      console.log('Error: No ads to post')
      logger.error('Error: No ads to post')
    }
  }

  //used by exportjson function
  sanitizeField(field){
    const sanitizedField = field.replace(/[^A-Za-z0-9]/g, '')

    return sanitizedField.toLowerCase()
  }

  //scraper methods
  async start(){

    /*use module functions defined in json
    fix path and require it
    */
    logger.info(`Starting scrape for '${this.getConf().getName()}'`)
    let redirect_module = this.getConf().getModule()
    redirect_module     = redirect_module.replace(/^\.\//, '../../../')
    const opt_module    = require(redirect_module)
    logger.info(`Using module '${redirect_module}'`)

    let url      = this.getConf().getUrl()
    let totalAds = this.getConf().getTotalAds()

    const driver    = this.getDriver()
    let ad_urls     = this.getAdUrls()
    let export_json = []

    if ( !url[0] )
    {
        console.log("No URL parameter found")
        logger.error(`No URL parameter found`)
        process.exit()
    }
    for (let x = 0; x < url.length; x++)
    {
        console.log(`\nVisiting URL ${url[x]}`)
        logger.info(`Visiting URL ${url[x]}`)
        try
        {
            await driver.get(url[x])
            await opt_module.results_page(ad_urls,driver)
        }
        catch(err)
        {
            console.log(err.message)
            logger.error(err.message)
            await driver.quit()
            process.exit()
        }
        console.log(`\nTotal ad urls found:|${ad_urls.length}|\n=====================================\n`)
        logger.info(`Total ad urls found:${ad_urls.length}`)
        let s = 1
        ad_urls.forEach((ad, s) => {
          console.log(`Ad url ${s + 1} : ${ad}`)
          s++
        })

        if (totalAds && typeof totalAds !== 'number' )
        {
            console.log('\nError - totalAds is not a number')
            logger.error(`Error - totalAds is not a number`)
            await driver.quit()
            process.exit()
        }
        else
        {
            if ( totalAds > ad_urls.length ) totalAds = ad_urls.length
        }

        for (let i = 0; i < totalAds; i++)
        {
            console.log(`\nvisiting url: ${ad_urls[i]}`)
            await driver.get(ad_urls[i])

            //deep clone ad fields
            let adfields = {...this.getAdFields()}

            console.log(`\n=========================\nAd ${i + 1} \n\nFetching ad fields:`)
            logger.info(`${ad_urls[i]}: Fetching ad fields`)
            let ad_fields_mut = await opt_module.ad_page(driver, ad_urls[i], adfields)

            //if all required ad fields are present, add ad for indexing
            if (ad_fields_mut !== null && ad_fields_mut.title && ad_fields_mut.description && ad_fields_mut.url)
            {
                export_json.push(ad_fields_mut)
                console.log(ad_fields_mut)
                // avoid showing ad fields - too much noise for the logs
                logger.info(`${ad_urls[i]}: Fetched ad fields successfully`)
            }
            //else, reject
            else
            {
                console.log('Ad got rejected due to missing required title/description/url fields')
                logger.error('Ad got rejected due to missing required title/description/url fields')
            }
            console.log("\n=========================\n")
        }

        //we empty the ad_urls array to refill it with the ads of the next url
        ad_urls = []
    }

    //export data to json file
    const dateNow = new Date('YYYYMMDDHHSS').getDateTimeNow()
    exportJSON(`./exports/${this.sanitizeField(this.getConf().getName())}-${dateNow}.json`, export_json)

    //index ads to mongodb job collection
    //handle job indexing in chunks of 20 ads - avoid big payloads
    const adchunks = new Array(Math.ceil(export_json.length / 20)).fill().map(_ => export_json.splice(0, 20))

    adchunks.forEach(chunk => {
      this.indexAd(chunk)
    })

    await driver.quit()
    process.exit()
  }
}

module.exports = { Scrape }
