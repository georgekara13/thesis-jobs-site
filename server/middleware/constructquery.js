const { Job } = require('../model/job')
const { Source } = require('../model/source')
const { Announcement } = require('../model/announcement')
const { logger } = require('../configuration/logger')

//middleware for constructing a filter object & getting the total count of docs
let jobQuery = (req, res, next) => {
  let { keyword, jobTag, salaryMin, location, _id } = req.query

  // filter for the 'where' clause
  let filter = {}

  if (jobTag) {
    // The jobTag param contains multiple values e.g it,sales,unknown
    if (jobTag.includes(',')) {
      filter['$or'] = []

      // add each jobtag under the 'or' clause: { $or: [ {jobTag: it}, {jobTag: marketing}, {jobTag: sales} ] }
      jobTag.split(',').forEach((tag) => {
        filter['$or'].push({ jobTag: tag })
      })
    } else {
      // single jobTag value, no need for an 'or' clause
      filter.jobTag = jobTag
    }
  }

  // this is not part of the search query - used only by the favourites view
  if (_id) {
    // The _id param contains multiple values e.g uwefu3hf,3i23rnf,e2fvced
    if (_id.includes(',')) {
      filter['$or'] = []

      // add each _id under the 'or' clause: { $or: [ {_id: euff3h}, {_id: wdiuf3}, {_id: csncewc} ] }
      _id.split(',').forEach((id) => {
        filter['$or'].push({ _id: id })
      })
    } else {
      // single _id value, no need for an 'or' clause
      filter._id = _id
    }
  }

  if (location) {
    filter.location = location
  }

  if (salaryMin) {
    filter.salaryMin = { $gte: salaryMin }
  }

  /*final filter looks like this(if any params):
  filter = {$and: [{$or: [ {jobTag: it}, {jobTag: marketing}, {jobTag: sales} ]}, {salaryMin: { $gte: salaryMin }}, {location: location}]}
  get total count of docs*/
  Job.find(filter)
    .fuzzySearch({ query: keyword, exact: true })
    .countDocuments()
    .then((count) => {
      req.total = count
      req.filter = filter
      logger.info(`Fetched ${count} results for '${JSON.stringify(req.query)}'`)
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
