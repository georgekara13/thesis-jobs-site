const { Role } = require('./../model/role')
const { User } = require('./../model/user')

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }
    if (user) {
      res.status(400).send({ message: 'Failed! Username is already in use!' })
      return
    }
    // Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      if (user) {
        res.status(400).send({ message: 'Failed! Email is already in use!' })
        return
      }
      next()
    })
  })
}
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    Role.find({ name: { $in: req.body.roles } }).exec((err, roles) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      if (roles.length !== req.body.roles.length) {
        res.status(400).send({
          message: 'Failed! Some of the roles do not exist!',
        })
        return
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
