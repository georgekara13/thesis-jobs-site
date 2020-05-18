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
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: '-'
  },
  salary: {
    type: Number,
    default: 0,
    min: 0,
    max: 100000
  },
  jobTag: {
    type: String,
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
    required: true
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
  }
}, {timestamps: true})

const Job = mongoose.model('Job', jobSchema)

module.exports = { Job }
