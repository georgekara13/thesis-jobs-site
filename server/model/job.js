const mongoose = require('mongoose')

/*
  We may need one more type for the schema - jobHash
  this will be generated by combining job title,location,company into an md5 hash
  and will be used for removing duplicate jobs - to be discussed
*/
const jobSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: '-'
  },
  salaryMin: {
    type: Number,
    default: 0,
    min: 0,
    max: 100000
  },
  salaryMax: {
    type: Number,
    default: 0,
    min: 0,
    max: 100000
  },
  jobTag: {
    type: [String],
    enum: [
            "marketing",
            "economics",
            "it",
            "sales",
            "sports",
            "catering",
            "healthcare",
            "logistics",
            "arts",
            "customer-service",
            "unknown"
    ],
    default: "unknown"
  },
  location: {
    type: String,
    default: '-'
  },
  contactPhone: {
    type: String,
    default: '-'
  },
  contactEmail: {
    type: String,
    default: '-'
  },
  jobHash: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  }
}, {timestamps: true})

const Job = mongoose.model('Job', jobSchema)

module.exports = { Job }
