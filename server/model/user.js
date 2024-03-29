const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dbconf = require('../configuration/dbconf').dbconf()

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
  token: {
    type: String,
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: [],
    },
  ],
})

userSchema.methods.generateToken = function (cb) {
  var user = this
  var token = jwt.sign(user._id.toHexString(), dbconf.SECRET)

  user.token = token
  user.save(function (err, user) {
    if (err) return cb(err)
    cb(null, user)
  })
}

//used for destroying user session
userSchema.methods.deleteToken = function (token, cb) {
  var user = this

  user.updateOne({ $unset: { token: 1 } }, (err, user) => {
    if (err) return cb(err)
    cb(null, user)
  })
}

userSchema.statics.findByToken = function (token, cb) {
  var user = this

  jwt.verify(token, dbconf.SECRET, function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
