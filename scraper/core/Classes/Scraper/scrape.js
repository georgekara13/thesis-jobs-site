const { logger } = require('../../../configuration/environment/logger')

class Scrape {
  constructor(Conf, Driver) {
    this._conf = Conf
    this._driver = Driver
    this._totalads = 0
    this._scrapetime = 0
    this._adstatistics = {}
    this._adurls = []
    this._adfields = {
      title: '',
      description: '',
      location: '',
      salaryMin: '',
      salaryMax: '',
      company: '',
      jobTag: [],
      contactPhone: '',
      contactEmail: '',
      url: '',
    }
  }

  getConf() {
    return this._conf
  }

  getDriver() {
    return this._driver
  }

  getTotalAds() {
    return this._totalads
  }
  setTotalAds(totalads) {
    this._totalads = totalads
  }

  getScrapeTime() {
    return this._scrapetime
  }
  setScrapeTime(scrapetime) {
    this._scrapetime = scrapetime
  }

  getAdUrls() {
    return this._adurls
  }
  setAdUrls(adurls) {
    this._adurls = adurls
  }

  getAdStatistics() {
    return this._adstatistics
  }
  setAdStatistics(adstatistics) {
    this._adstatistics = adstatistics
  }

  getAdFields() {
    return this._adfields
  }

  //scraper methods
  async start(emitter) {
    /*use module functions defined in json
    fix path and require it
    */
    logger.info(`Starting scrape for '${this.getConf().getName()}'`)
    let redirect_module = this.getConf().getModule()
    redirect_module = redirect_module.replace(/^\.\//, '../../../')
    const opt_module = require(redirect_module)

    let url = this.getConf().getUrl()
    let totalAds = this.getConf().getTotalAds()

    const driver = this.getDriver()
    let ad_urls = this.getAdUrls()
    let export_json = []

    if (!url[0]) {
      logger.error(`No URL parameter found`)
      await driver.quit()
      return
    }
    for (let x = 0; x < url.length; x++) {
      logger.info(`Visiting URL ${url[x]}`)
      try {
        await driver.get(url[x])
        await opt_module.results_page(ad_urls, driver)
      } catch (err) {
        logger.error(err.message)
        await driver.quit()
        return
      }

      logger.info(`Total ad urls found:${ad_urls.length}`)

      ad_urls.forEach((ad, s) => {
        s++
        logger.info(`Ad ${s}: ${ad}`)
      })

      if (totalAds && typeof totalAds !== 'number') {
        logger.error(`Error - totalAds is not a number`)
        await driver.quit()
        return
      } else {
        if (totalAds > ad_urls.length) totalAds = ad_urls.length
      }

      for (let i = 0; i < totalAds; i++) {
        await driver.get(ad_urls[i])

        //deep clone ad fields
        let adfields = { ...this.getAdFields() }

        logger.info(`${ad_urls[i]}: Fetching ad fields`)
        let ad_fields_mut = await opt_module.ad_page(
          driver,
          ad_urls[i],
          adfields
        )

        //if all required ad fields are present, add ad for indexing
        if (
          ad_fields_mut !== null &&
          ad_fields_mut.title &&
          ad_fields_mut.description &&
          ad_fields_mut.url
        ) {
          export_json.push(ad_fields_mut)
          // avoid showing ad fields - too much noise for the logs
          logger.info(
            `${ad_urls[i]}: Fetched ad fields successfully: ${JSON.stringify(
              ad_fields_mut
            )}`
          )
        }
        //else, reject
        else {
          logger.error(
            `${ad_urls[i]}: Ad got rejected due to missing required title/description/url fields`
          )
        }
      }

      //we empty the ad_urls array to refill it with the ads of the next url
      ad_urls = []
    }

    //index ads to mongodb job collection
    //handle job indexing in chunks of 20 ads - avoid big payloads
    const adchunks = new Array(Math.ceil(export_json.length / 20))
      .fill()
      .map((_) => export_json.splice(0, 20))

    adchunks.forEach((chunk) => {
      if (chunk.length !== 0) {
        emitter.emit('indexAds', chunk)
      } else {
        logger.warn('Will not emit an indexAds event - No ads to post')
      }
    })

    await driver.quit()
    return
  }
}

module.exports = { Scrape }
