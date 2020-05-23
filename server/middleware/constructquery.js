const { Job } = require('../model/job')

//middleware for constructing job queries
let jobQuery = (req, res, next) => {
  let query    = req.query
  let queryObj = {}

  /*fetch query params, append to json unless not defined
  note: ids are unique, no need to use here. Use getjobbid route*/
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

module.exports = { jobQuery }
