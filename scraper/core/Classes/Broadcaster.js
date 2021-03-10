const EventEmitter = require('events')
const webdriver = require('selenium-webdriver') //By,Builder,Key,promise,until
const { promisify } = require('util')
const axios = require('axios')
const moment = require('moment')
const { driverBuilder } = require('../Builder/driverbuilder')
const { scrapeBuilder } = require('../Builder/scrapebuilder')
const { Conf } = require('./conf')
const { logger } = require('../../configuration/environment/logger')
const scraperConf = require('../../configuration/environment/scraperconf').scraperConf()

// Class for registering & emitting scraper events

class Broadcaster extends EventEmitter {
  constructor() {
    super()
    this.on('scheduleScrapes', () => {
      this.scheduleScrapes()
    })

    this.on('scrapeSource', (args) => {
      this.scrapeSource(args)
    })

    this.on('indexAds', (args) => {
      this.indexAds(args)
    })
  }

  scheduleScrapes() {
    logger.info('Emitted a scheduleScrapes event')

    axios
      .get(`${scraperConf.HOST}/api/getsources`)
      .then((response) => {
        if (response.data.results == 0) {
          logger.warn(`No sources found, will not emit scrape events`)
        } else {
          response.data.sources.forEach((source) => {
            // calculate the minutes difference between now & last scrape
            let calculateMinutes = Math.floor(
              moment
                .duration(moment(Date.now()).diff(moment(source.lastRun)))
                .asMinutes()
            )

            // only scrape active sources & it's time for them to scrape
            if (
              source.scrapeFrequency > 0 &&
              calculateMinutes >= source.scrapeFrequency
            ) {
              logger.info(
                `Will broadcast a scrapeSource event for source '${source.name}' id: ${source._id}`
              )
              this.emit('scrapeSource', source)
            } else {
              logger.info(
                `Difference now->lastRun: ${calculateMinutes} , Source frequency: ${source.scrapeFrequency}. Skipping scrape`
              )
            }
          })
        }
      })
      .catch((e) => logger.error(e))
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

    /*update lastRun timestamp for source - we don't care if the run was sucessful.
    If we would, then it should be handled by the indexAds event*/
    axios
      .post(`${scraperConf.HOST}/api/updatesource`, {
        _id: conf._id,
        lastRun: Date.now(),
      })
      .then((response) => {
        response.data.success
          ? logger.info(`Updated lastRun timestamp for source ${conf._id}`)
          : logger.error(
              `Could not update lastRun timestamp for source ${conf._id}`
            )
      })
      .catch((e) => logger.error(e))
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
