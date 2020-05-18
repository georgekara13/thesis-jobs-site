const mongoose = require('mongoose')

//to be discussed
const userSchema = mongoose.Schema({

})

const User = mongoose.model('User', userSchema)

module.exports = { User }
