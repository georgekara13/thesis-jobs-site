const {Scrape} = require('./scrape')

class JobScrape extends Scrape {
  constructor(Conf, Driver){
    super(Conf, Driver)
  }
}

module.exports = { JobScrape }
