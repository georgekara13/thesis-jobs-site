const mongoose = require('mongoose')
const jwt      = require('jsonwebtoken')
const dbconf   = require('../configuration/dbconf').dbconf()

//to be discussed
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  token: {
    type: String
  }
  /*password: {
    type: String,
    required: true,
    minlength: 8 //to be confirmed
  }*/
})

userSchema.methods.generateToken = function(cb){
  var user  = this
  var token = jwt.sign(user._id.toHexString(), dbconf.SECRET)

  user.token = token
  user.save(function(err, user){
    if(err) return cb(err)
    cb(null, user)
  })
}

//used for destroying user session
userSchema.methods.deleteToken = function(token, cb){
  var user = this

  user.updateOne({$unset: {token: 1}}, (err, user) => {
    if (err) return cb(err)
    cb (null, user)
  })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this

    jwt.verify(token, dbconf.SECRET, function(err, decode){
        user.findOne({"_id": decode, "token": token}, function(err, user){
            if (err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
