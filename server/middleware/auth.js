const {User}     = require('./../model/user')
const { logger } = require('../configuration/logger')

let auth = (req, res, next) => {
  let token = req.cookies.auth

  User.findByToken(token, (err, user) => {
    if (err){
      logger.warn(err)
      return res.status(400).send(err)
    }
    if (!user) return res.json({error:true})

    req.token = token
    req.user  = user
    next()
  })
}

module.exports = {auth}
