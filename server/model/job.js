const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: '-',
    },
    salaryMin: {
      type: Number,
      default: 0,
      min: 0,
      max: 100000,
    },
    salaryMax: {
      type: Number,
      default: 0,
      min: 0,
      max: 100000,
    },
    jobTag: {
      type: [String],
      enum: [
        'marketing',
        'economics',
        'it',
        'sales',
        'sports',
        'catering',
        'healthcare',
        'logistics',
        'arts',
        'customer-service',
        'unknown',
      ],
      default: 'unknown',
    },
    location: {
      type: String,
      default: '-',
    },
    contactPhone: {
      type: String,
      default: '-',
    },
    contactEmail: {
      type: String,
      default: '-',
    },
    jobHash: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

//apply unique validator plugin to jobschema
jobSchema.plugin(uniqueValidator)

/*fuzzy search - for each newly inserted/updated doc, the plugin will ad a set of ngrams
for now it only makes sense to create ngrams for the following 4 fields
!Warning! - The ngrams will only be applied for new/updated docs! If any of the existing
ones don't have ngrams, an update must be triggered for them
*/
jobSchema.plugin(mongooseFuzzySearching, {
  fields: ['title', 'description', 'company', 'location'],
})

const Job = mongoose.model('Job', jobSchema)

module.exports = { Job }
