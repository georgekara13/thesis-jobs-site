//define scraper classes here
const { JobScrape } = require('../Classes/Scraper/jobscrape')
const { logger } = require('../../configuration/environment/logger')

const scrapeBuilder = (Conf, Driver) => {
  const scrapetype = Conf.getScrapeType()
  switch (scrapetype) {
    case 'jobs':
      return new JobScrape(Conf, Driver)
    default:
      if (scrapetype)
        logger.warn(
          `Scrape type '${scrapetype}' not recognized. Falling back to jobs scrape`
        )
      return new JobScrape(Conf, Driver)
  }
}

module.exports = { scrapeBuilder }
