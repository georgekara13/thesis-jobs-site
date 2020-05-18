const mongoose = require('mongoose')

const sourceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  browser: {
    name: {
      type: String,
      enum: ["firefox", "chrome"],
      default: "firefox"
    },
    mode: {
      type: String,
      enum: ["gui", "headless"],
      default: "headless"
    }
  },
  conf: {
    module: {
      type: String,
      required: true
    },
    url: {
      type: [String],
      required: true
    },
    totalAds: {
      type: Number,
      default: 20,
      min: 1,
      max: 10000
    },
    scrapeFrequency: {
      type: Number,
      min: 0,
      max: 2880,
      default: 1440
    }
  }
})

const Source = mongoose.model('Source', sourceSchema)

module.exports = { Source }
