const { Job }    = require('../model/job')
const { Source } = require('../model/source')

//middleware for constructing job queries
let jobQuery = (req, res, next) => {
  let query    = req.query
  let queryObj = {}

  /*fetch query params, append to json unless not defined
  note: ids are unique, no need to use here. Use getjobbyid route*/
  if (query.title)        queryObj.title        = query.title
  if (query.description)  queryObj.description  = query.description //overkill - TODO use keyword search
  if (query.salaryMin)    queryObj.salaryMin    = query.salaryMin
  if (query.salaryMax)    queryObj.salaryMax    = query.salaryMax
  if (query.jobTag)       queryObj.jobTag       = query.jobTag
  if (query.location)     queryObj.location     = query.location
  if (query.contactPhone) queryObj.contactPhone = query.contactPhone
  if (query.contactEmail) queryObj.contactEmail = query.contactEmail
  if (query.company)      queryObj.company      = query.company

  Job.find(queryObj).exec((err, doc) => {
    if (err) throw err
    if(!doc.length) return res.json({error:"No jobs found"})

    req.jobs = doc
    next()
  })
}

//middleware for constructing source queries
let sourceQuery = (req, res, next) => {
  let query        = req.query
  let queryObj     = {}

  //add keys for the nested params if defined
  if (query.browserName || query.browserMode) queryObj.browser = {}
  if (query.confModule || query.confUrl || query.confTotalAds || query.confScrapeFrequency) queryObj.conf = {}

  /*fetch query params, append to json unless not defined
  note: ids are unique, no need to use here. Use getsourcebbyid route*/
  if (query.name)                queryObj.name                 = query.name
  if (query.browserName)         queryObj.browser.name         = query.browserName
  if (query.browserMode)         queryObj.browser.mode         = query.browserMode
  if (query.confModule)          queryObj.conf.module          = query.confModule
  if (query.confUrl)             queryObj.conf.url             = query.confUrl
  if (query.confTotalAds)        queryObj.conf.totalAds        = query.confTotalAds
  if (query.confScrapeFrequency) queryObj.conf.scrapeFrequency = query.confScrapeFrequency

  /*FIXME if one of the query params for the nested keys is missing, we get no results
  Mongoose is using exact match atm.
  This http://localhost:3001/api/getsources?browserName=firefox&browserMode=headless
  returns results,
  while this http://localhost:3001/api/getsources?browserName=firefox
  returns an error no sources found response
  we need the $or operator for the nested fields - see https://docs.mongodb.com/manual/reference/operator/query/
  */
  Source.find(queryObj).exec((err, doc) => {
    if (err) throw err
    if(!doc.length) return res.json({error:"No sources found"})

    req.sources = doc
    next()
  })
}

module.exports = { jobQuery, sourceQuery }
