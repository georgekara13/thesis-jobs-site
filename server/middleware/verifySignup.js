const { Role } = require('./../model/role')
const { User } = require('./../model/user')
//const { logger } = require('../configuration/logger')

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.userName,
  }).exec((err, user) => {
    if (err) {
      req.errorSignup = { message: err, success: false }
      next()
    }
    if (user) {
      req.errorSignup = {
        success: false,
        message: 'Το όνομα χρήστη υπάρχει ήδη, δοκιμάστε άλλο.',
      }
      next()
    }
    // Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        req.errorSignup = { message: err, success: false }
        next()
      }
      if (user) {
        req.errorSignup = {
          success: false,
          message: 'Το email χρήστη υπάρχει ήδη, δοκιμάστε άλλο',
        }
        next()
      }
      next()
    })
  })
}
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    Role.find({ name: { $in: req.body.roles } }).exec((err, roles) => {
      if (err) {
        req.errorSignup = { success: false, message: err }
        next()
      }
      if (roles.length !== req.body.roles.length) {
        req.errorSignup = {
          success: false,
          message: 'Σφάλμα, κάποιοι απ τους ρόλους δεν υπάρχουν',
        }
        next()
      }
    })
  }
  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
}
module.exports = verifySignUp
