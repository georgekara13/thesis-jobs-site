//define scraper classes here
const {JobScrape}  = require('../Classes/Scraper/jobscrape')

const scrapeBuilder = (Conf, Driver) => {
  const scrapetype = Conf.getScrapeType()
  switch (scrapetype){
    case 'jobs':
      return new JobScrape(Conf, Driver)
      break
    default:
      if (scrapetype) console.log(`Scrape type '${scrapetype}' not recognized. Falling back to jobs scrape`)
      return new JobScrape(Conf, Driver)
  }
}

module.exports = { scrapeBuilder }
