/*
    get request to http://localhost:3001/api/getsources
    for each scrape:
        if moment duration(current datetime - last_run) > scrape_frequency -> emit scrape event
        https://stackoverflow.com/questions/35543294/moment-js-calculating-duration-in-hours-betwen-2-dates
*/
const axios = require('axios')
const EventEmitter = require('events')
const { logger } = require('./configuration/environment/logger')
const scraperConf = require('./configuration/environment/scraperconf').scraperConf()
const { scrapeSource } = require('./core/events')

logger.info('Starting scraper scheduler')

const emitter = new EventEmitter()

emitter.on('scrapeSource', scrapeSource)

axios.get(`${scraperConf.HOST}/api/getsources`).then((response) => {
  if (response.data.results == 0) {
    logger.warn(`No sources found, will not emit scrape events`)
  } else {
    response.data.sources.forEach((source) => {
      logger.info(
        `Will broadcast a scrapeSource event for source id: ${source._id}`
      )
      emitter.emit('scrapeSource', source)
    })
  }
})
