const mongoose = require('mongoose')

const sourceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    enum: ['firefox', 'chrome'],
    default: 'firefox',
  },
  mode: {
    type: String,
    enum: ['gui', 'headless'],
    default: 'headless',
  },
  module: {
    type: String,
    required: true,
  },
  scrapeType: {
    type: String,
    default: 'jobs',
  },
  url: {
    type: [String],
    required: true,
  },
  totalAds: {
    type: Number,
    default: 20,
    min: 1,
    max: 10000,
  },
  scrapeFrequency: {
    type: Number,
    min: 0,
    max: 2880,
    default: 1440,
  },
  lastRun: {
    type: Date,
    default: '2010', // 2010-01-01T00:00:00.000Z
  },
})

const Source = mongoose.model('Source', sourceSchema)

module.exports = { Source }
