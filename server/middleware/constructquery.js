const { Job } = require('../model/job')
const { Source } = require('../model/source')
const { Announcement } = require('../model/announcement')
const { logger } = require('../configuration/logger')

//middleware for getting the total count of docs
let jobQuery = (req, res, next) => {
  let { keyword } = req.query

  //get total count of docs
  Job.fuzzySearch({ query: keyword, exact: true })
    .countDocuments()
    .then((count) => {
      req.total = count
      logger.info(`Fetched ${count} results for keyword '${keyword}'`)
      next()
    })
}

//middleware for constructing source queries
let sourceQuery = (req, res, next) => {
  let query = req.query
  let queryObj = {}

  /*fetch query params, append to json unless not defined
  note: ids are unique, no need to use here. Use getsourcebbyid route*/
  if (query.name) queryObj.name = query.name
  if (query.browser) queryObj.browser = query.browser
  if (query.mode) queryObj.mode = query.mode
  if (query.module) queryObj.module = query.module
  if (query.url) queryObj.url = query.url
  if (query.totalAds) queryObj.totalAds = query.totalAds
  if (query.scrapeFrequency) queryObj.scrapeFrequency = query.scrapeFrequency

  Source.find(queryObj).exec((err, doc) => {
    if (err) {
      logger.warn(err)
      return res.status(400).send(err)
    }
    if (!doc.length) return res.json({ error: 'No sources found' })

    req.sources = doc
    next()
  })
}

//middleware for announcement pagination
let announcementQuery = (req, res, next) => {
  let query = req.query
  let { page = 1, limit = 10 } = query

  if (limit > 10) limit = 10

  let queryObj = {}

  // latest announcements should display first
  Announcement.find(queryObj)
    .sort('-updatedAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec((err, doc) => {
      if (err) {
        logger.warn(err)
        return res.status(400).send(err)
      }
      if (!doc.length) return res.json({ error: 'No announcements found' })

      req.announcements = doc
      req.currentPage = page
      next()
    })
}

module.exports = { jobQuery, announcementQuery, sourceQuery }
