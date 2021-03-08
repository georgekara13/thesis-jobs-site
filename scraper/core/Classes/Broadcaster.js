const EventEmitter = require('events')
const webdriver = require('selenium-webdriver') //By,Builder,Key,promise,until
const { promisify } = require('util')
const axios = require('axios')
const { driverBuilder } = require('../Builder/driverbuilder')
const { scrapeBuilder } = require('../Builder/scrapebuilder')
const { Conf } = require('./conf')
const { logger } = require('../../configuration/environment/logger')
const scraperConf = require('../../configuration/environment/scraperconf').scraperConf()

// Class for registering & emitting scraper events

class Broadcaster extends EventEmitter {
  constructor() {
    super()
    this.on('scrapeSource', (args) => {
      this.scrapeSource(args)
    })

    this.on('indexAds', (args) => {
      this.indexAds(args)
    })
  }

  scrapeSource(conf) {
    //Disable promise manager use Node's native async/await
    webdriver.USE_PROMISE_MANAGER = false

    logger.info(
      `Emitted a scrapeSource event for source ${conf.name} - id ${conf._id}`
    )

    const confFile = new Conf(conf)

    const { browser, mode } = conf

    //Instantiate Browser object & build driver
    const browserDriver = driverBuilder(browser, mode)
    const driver = browserDriver.getDriver()

    logger.info(
      `Source id ${
        conf._id
      } - Browser: ${browserDriver.getName()} \nMode: ${browserDriver.getMode()}`
    )

    //instantiate scrape object
    const scrape = scrapeBuilder(confFile, driver)

    // pass the emitter instance as parameter to the scraper
    scrape.start(this)
  }

  indexAds(ads) {
    logger.info(`Emitted an indexAds event for ${ads.length} ads`)

    axios
      .post(`${scraperConf.HOST}/api/addjobs`, ads)
      .then((response) => {
        logger.info(JSON.stringify(response.data))
      })
      .catch((e) => logger.error(e))
  }
}

// create an event emitter instance, and export it
const emitter = new Broadcaster()

module.exports = { emitter }
