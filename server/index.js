const express = require('express')
const mongoose = require('mongoose')
const dbconf = require('./configuration/dbconf').dbconf()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var ldapClient = require('promised-ldap')
const { logger } = require('./configuration/logger')

//models
const { User } = require('./model/user')
const { Job } = require('./model/job')
const { Source } = require('./model/source')
const { Announcement } = require('./model/announcement')

//middleware
const {
  jobQuery,
  sourceQuery,
  announcementQuery,
} = require('./middleware/constructquery')
const { auth } = require('./middleware/auth')
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
const ldap = new ldapClient({ url: dbconf.LDAP })

app.use(bodyParser.json())
//change payload size in mbs. Not recommended
//app.use(bodyParser.json({limit:'50mb'}))
//app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}))
app.use(cookieParser())

//GET routes
app.get('/api/userisauth', auth, (req, res) => {
  res.json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    favourites: req.user.favourites,
  })
})

app.get('/api/logout', auth, (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err)
    res.sendStatus(200)
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

  // redo the query to return paged results
  Job.fuzzySearch({ query: keyword, exact: true })
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

//POST routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const options = { filter: `(&(mail=${email})(userPassword=${password}))` }

  //search for entry in ldap - if it exists, proceed with auth
  ldap
    .search('dc=test', options)
    .then((result) => {
      //ldap confirms user email & password
      if (result.entries[0]) {
        //check if user email exists in User collection
        User.findOne({ email }, (err, user) => {
          //if not, add them
          if (!user) {
            let user = new User({ email })
            user.generateToken((err, user) => {
              if (err) return res.status(400).send(err)
              //send user data as a response cookie
              res.cookie('auth', user.token).json({
                isAuth: true,
                id: user._id,
                email: user.email,
              })
            })
          } else {
            //generate token for user
            user.generateToken((err, user) => {
              if (err) return res.status(400).send(err)
              //send user data as a response cookie
              res.cookie('auth', user.token).json({
                isAuth: true,
                id: user._id,
                email: user.email,
              })
            })
          }
        })
      } else {
        res.status(401).json({ error: 'User auth error' })
      }
    })
    .catch((err) => res.status(200).json({ error: err }))
})

app.post('/api/addjob', (req, res) => {
  const job = new Job(req.body)

  job.save((err, doc) => {
    if (err) {
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.status(200).json({
      post: true,
      jobId: doc._id,
    })
  })
})

app.post('/api/addtofavourites', auth, (req, res) => {
  const { userid, jobid } = req.query

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
app.post('/api/addannouncement', (req, res) => {
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
})

app.post('/api/addjobs', createJobHash, (req, res) => {
  req.hashedjobs.forEach((job) => {
    const newJob = new Job(job)
    newJob.save((err, doc) => {
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

  User.updateOne(
    { _id: userid },
    { $pull: { favourites: jobid } },
    (err, doc) => {
      if (!err) {
        res.status(200).json({
          delete: true,
          jobid,
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

app.listen(port, () => {
  console.log(`API is up in port ${port}, running in ${dbconf.MODE} mode`)
  logger.info(`API is up in port ${port}, running in ${dbconf.MODE} mode`)
})
