const saltedMd5  = require('salted-md5');
const salt       = '0Yy LUm@o';
const { logger } = require('../configuration/logger')

//used by md5 jobhash
let sanitizeField = (field) =>  {
  const sanitizedField = field.replace(/[^A-Za-z0-9]/g, '')

  return sanitizedField.toLowerCase()
}

/*combine title + location + company into a unique md5 hash
used for deduplication*/
let createJobHash = (req, res, next) => {
  const jobs = req.body

  jobs.forEach(job => {
    const combineFields = `${sanitizeField(job.title)}${sanitizeField(job.location)}${sanitizeField(job.company)}`
    logger.info(`Will sanitize ${combineFields}`)
    job.jobHash = saltedMd5(combineFields, salt)
    logger.info(`Resulting jobhash: ${job.jobHash}`)
  })

  req.hashedjobs = jobs
  next()
}

module.exports = { createJobHash }
