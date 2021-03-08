/*
    get request to http://localhost:3001/api/getsources
    for each scrape:
        if moment duration(current datetime - last_run) > scrape_frequency -> emit scrape event
        https://stackoverflow.com/questions/35543294/moment-js-calculating-duration-in-hours-betwen-2-dates
*/
const axios = require('axios')
const { emitter } = require('./core/Classes/Broadcaster')
const { logger } = require('./configuration/environment/logger')
const scraperConf = require('./configuration/environment/scraperconf').scraperConf()

logger.info('Starting scraper scheduler')

axios.get(`${scraperConf.HOST}/api/getsources`).then((response) => {
  if (response.data.results == 0) {
    logger.warn(`No sources found, will not emit scrape events`)
  } else {
    response.data.sources.forEach((source) => {
      if (source.scrapeFrequency > 0) {
        logger.info(
          `Will broadcast a scrapeSource event for source id: ${source._id}`
        )
        emitter.emit('scrapeSource', source)
      }
    })
  }
})
