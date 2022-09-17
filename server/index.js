const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { createJwtToken } = require('./helpers')
const dbconf = require('./configuration/dbconf').dbconf()
const { logger } = require('./configuration/logger')
const { emitter } = require('./configuration/broadcaster')

//models
const { User } = require('./model/user')
const { Job } = require('./model/job')
const { Source } = require('./model/source')
const { Role } = require('./model/role')
const { Announcement } = require('./model/announcement')

//middleware
const {
  jobQuery,
  sourceQuery,
  announcementQuery,
} = require('./middleware/constructquery')
const { auth, authJwt } = require('./middleware/auth')
const { createJobHash } = require('./middleware/jobhash')

mongoose.Promise = global.Promise
mongoose.connect(dbconf.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const port = process.env.PORT || 3001
const app = express()

app.use(bodyParser.json())
//change payload size in mbs. Not recommended
//app.use(bodyParser.json({limit:'50mb'}))
//app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}))
app.use(cookieParser())

app.use(
  cookieSession({
    name: 'bezkoder-session',
    keys: ['key1', 'key2'],
    secret: process.env.COOKIE_SECRET, // should use as secret environment variable
    httpOnly: true,
  })
)

app.use(cors())

//GET routes
app.get('/api/userisauth', auth, (req, res) => {
  res.json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    favourites: req.user.favourites,
  })
})

app.get('/api/getjobbyid', (req, res) => {
  let id = req.query.id

  Job.findById(id, (err, doc) => {
    if (err) {
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.send(doc)
  })
})

app.get('/api/getjobs', jobQuery, async (req, res) => {
  let { page = 1, limit = 9, keyword } = req.query

  if (limit > 36) limit = 36

  // filter is constructed by the middleware (see constructquery.js)
  Job.find(req.filter)
    .fuzzySearch({ query: keyword, exact: true })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec((err, doc) => {
      if (err) {
        logger.warn(err)
        return res.status(400).send(err)
      }
      if (!doc.length) return res.json({ error: 'No jobs found' })

      //cast to int
      currentPage = parseInt(page)

      let totalPages = Math.ceil(req.total / limit)
      let nextPage = currentPage < totalPages ? currentPage + 1 : 0
      let previousPage = currentPage > 1 ? currentPage - 1 : 0

      res.status(200).json({
        results: req.total,
        jobs: doc,
        currentPage,
        perPage: limit,
        totalPages,
        nextPage,
        previousPage,
      })
    })
})

app.get('/api/getannouncements', announcementQuery, async (req, res) => {
  const count = await Announcement.countDocuments()
  let { limit = 10 } = req.query

  if (limit > 10) limit = 10

  res.status(200).json({
    results: req.announcements.length,
    announcements: req.announcements,
    totalPages: req.totalPages,
    currentPage: req.currentPage,
    totalPages: Math.ceil(count / limit),
  })
})

app.get('/api/getsourcebyid', (req, res) => {
  let id = req.query.id

  Source.findById(id, (err, doc) => {
    if (err) {
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.send(doc)
  })
})

app.get('/api/getsources', sourceQuery, (req, res) => {
  res.status(200).json({
    results: req.sources.length,
    sources: req.sources,
  })
})

app.post('/api/addtofavourites', authJwt.verifyToken, (req, res) => {
  const { jobid } = req.query
  const userid = req.userId

  logger.info(`Add to favs for user ${userid} , for job ${jobid}`)

  User.findById({ _id: userid })
    .exec()
    .then((user) => {
      user.favourites.push(jobid)

      // filter out duplicate ids
      let uniqueFavs = user.favourites.filter((c, index) => {
        return user.favourites.indexOf(c) === index
      })
      user.favourites = uniqueFavs

      user.save((err, doc) => {
        if (err) {
          logger.warn(err)
          return res.status(400).send(err)
        }
        res.status(200).json({
          post: true,
          doc,
        })
      })
    })
    .catch((err) => {
      logger.warn(err)
      return res.status(400).send(err)
    })
})

/*TODO ADD ADMIN AUTH MIDDLEWARE - only admin users should be able to post
announcements*/
app.post(
  '/api/addannouncement',
  authJwt.verifyToken,
  authJwt.isAdmin,
  (req, res) => {
    const announcement = new Announcement(req.body)

    announcement.save((err, doc) => {
      if (err) {
        logger.warn(err)
        return res.status(400).send(err)
      }
      res.status(200).json({
        post: true,
        announcementId: doc._id,
      })
    })
  }
)

app.post('/api/addjobs', createJobHash, (req, res) => {
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }

  /* if document already exists, update it - otherwise, create it
  we are using the jobhash middleware to figure it out
  req body looks like this [{job 1 fields},{job 2 fields},...{job n fields}]
  */
  req.hashedjobs.forEach((job) => {
    Job.findOneAndUpdate({ jobHash: job.jobHash }, job, options, (err, doc) => {
      if (err) {
        logger.warn(err)
      }
    })
  })

  res.status(200).json({ total_ads: req.hashedjobs.length, post: true })
})

app.post('/api/addsource', (req, res) => {
  const source = new Source(req.body)

  source.save((err, doc) => {
    if (err) {
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.status(200).json({
      post: true,
      sourceId: doc._id,
    })
  })
})

app.post('/api/addsources', (req, res) => {
  const sources = req.body

  sources.forEach((source) => {
    const newSource = new Source(source)
    newSource.save((err, doc) => {
      if (err) {
        logger.warn(err)
        return res.status(400).send(err)
      }
    })
  })

  res.status(200).json({ post: true })
})

//DELETE routes
app.delete('/api/deletejob', (req, res) => {
  let id = req.query.id

  Job.findByIdAndRemove(id, (err, doc) => {
    if (err) return res.status(400).send(err)
    res.json(true)
  })
})

app.delete('/api/deletesource', (req, res) => {
  let id = req.query.id

  Source.findByIdAndRemove(id, (err, doc) => {
    if (err) {
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.json(true)
  })
})

app.delete('/api/deletefromfavourites', auth, (req, res) => {
  const { userid, jobid } = req.query

  logger.info(`Delete favs for user ${userid} , for job ${jobid}`)

  User.findByIdAndUpdate(
    userid,
    { $pull: { favourites: jobid } },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.status(200).json({
          delete: true,
          doc,
        })
      } else {
        logger.warn(err)
        res.status(400).json({
          err,
        })
      }
    }
  )
})

//UPDATE routes
app.post('/api/updatejob', (req, res) => {
  Job.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, doc) => {
    if (err) {
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.json({
      success: true,
      doc,
    })
  })
})

app.post('/api/updatesource', (req, res) => {
  Source.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, doc) => {
      if (err) {
        logger.warn(err)
        return res.status(400).send(err)
      }
      res.json({
        success: true,
        doc,
      })
    }
  )
})

app.post('/api/auth/signup', (req, res) => {
  try {
    logger.info(JSON.stringify(req.body))
    const user = new User({
      username: req.body.userName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    })

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err })
              return
            }
            user.roles = roles.map((role) => role._id)
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err })
                return
              }

              const { token, authorities } = createJwtToken(user)

              logger.info(`New user registration for '${req.body.email}'`)
              res.status(200).send({
                message: 'User was registered successfully!',
                token,
                userData: {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  roles: authorities,
                  favourites: user.favourites,
                },
              })
            })
          }
        )
      } else {
        Role.findOne({ name: 'user' }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err })
            return
          }
          user.roles = [role._id]
          user.save((err, user) => {
            if (err) {
              res.status(500).send({ message: err })
              return
            }
            const { token, authorities } = createJwtToken(user)

            logger.info(`New user registration for '${req.body.email}'`)
            logger.info(`Initiating session for '${user.username}'`)
            res.status(200).send({
              message: 'User was registered successfully!',
              token,
              userData: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                favourites: user.favourites,
              },
            })
          })
        })
      }
    })
  } catch (error) {
    logger.error(error)
  }
})

app.post('/api/auth/signin', (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )
      if (!passwordIsValid) {
        return res.status(401).send({ message: 'Invalid Password!' })
      }

      const { token, authorities } = createJwtToken(user)

      req.session.token = token
      logger.info(`Initiating session for '${user.username}'`)
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        favourites: user.favourites,
        token,
      })
    })
})

app.post('/api/auth/signout', async (req, res) => {
  try {
    req.session = null
    return res.status(200).send({ message: "You've been signed out!" })
  } catch (err) {
    this.next(err)
  }
})

app.listen(port, () => {
  console.log(`API is up in port ${port}, running in ${dbconf.MODE} mode`)
  logger.info(`API is up in port ${port}, running in ${dbconf.MODE} mode`)

  // delete old ads(>14 days) from the index every 15 mins
  const interval = setInterval(() => {
    emitter.emit('deleteAds')
  }, 900000)
})
