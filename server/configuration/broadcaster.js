const EventEmitter = require('events')
const { logger } = require('./logger')

//models
const { Job } = require('../model/job')

// Class for registering & emitting server events
class Broadcaster extends EventEmitter {
  constructor() {
    super()
    this.on('deleteAds', () => {
      this.deleteAds()
    })
  }

  // event for deleting ads older than 14 days
  deleteAds() {
    logger.info('Emitted a deleteAds event')

    let diff = new Date()
    diff.setDate(diff.getDate() - 14)

    Job.deleteMany({ updatedAt: { $lt: diff } })
      .then((res, error) => {
        logger.info(`Deleted ${res.deletedCount} ads from index`)
      })
      .catch((error) => {
        logger.error(`Did not delete ads from index: ${error}`)
      })
  }
}

// create an event emitter instance, and export it
const emitter = new Broadcaster()

module.exports = { emitter }
