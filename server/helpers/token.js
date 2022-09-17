const jwt = require('jsonwebtoken')
const { Role } = require('../model/role')
const dbconf = require('../configuration/dbconf').dbconf()

const createJwtToken = (user) => {
  const authorities = []
  for (let i = 0; i < user.roles.length; i++) {
    Role.findOne({ _id: user.roles[i] }, (err, role) => {
      authorities.push('ROLE_' + role.name.toUpperCase())
    })
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      favourites: user.favourites,
    },
    dbconf.SECRET,
    {
      expiresIn: 86400, // 24 hours
    }
  )

  return { token, authorities }
}

module.exports = { createJwtToken }
