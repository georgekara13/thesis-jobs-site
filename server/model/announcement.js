const mongoose = require('mongoose')

const announcementSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {timestamps: true})

const Announcement = mongoose.model('Announcement', announcementSchema)

module.exports = { Announcement }
