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
  if (req.body.name) {
    Role.find({
      name: req.body.name,
    }).exec((err, role) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      if (!role) {
        res.status(400).send({
          message: `Failed! Role ${req.body.name} does not exist!`,
        })
        return
      }
      next()
    })
  }
}
next()

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
}
module.exports = verifySignUp
