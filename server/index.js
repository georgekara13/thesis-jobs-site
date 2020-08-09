const express      = require('express')
const mongoose     = require('mongoose')
const dbconf       = require('./configuration/dbconf').dbconf()
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
var ldapClient     = require('promised-ldap')
const {logger}     = require('./configuration/logger')

//models
const { User }   = require('./model/user')
const { Job }    = require('./model/job')
const { Source } = require('./model/source')

//middleware
const { jobQuery, sourceQuery } = require('./middleware/constructquery')
const { auth }                  = require('./middleware/auth')

mongoose.Promise = global.Promise
mongoose.connect(dbconf.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const port = process.env.PORT || 3001
const app  = express()
const ldap = new ldapClient({url: dbconf.LDAP})

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
    email: req.user.email
  })
})

app.get('/api/logout', auth, (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if(err) return res.status(400).send(err)
    res.sendStatus(200)
  })
})

app.get('/api/getjobbyid', (req, res) => {
  let id = req.query.id

  Job.findById(id, (err, doc) => {
    if (err){
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.send(doc)
  })
})

app.get('/api/getjobs', jobQuery, async (req, res) => {

  const count = await Job.countDocuments()
  let {limit = 10} = req.query

  if (limit > 100) limit = 100

  res.status(200).json({
    results: req.jobs.length,
    jobs: req.jobs,
    totalPages: req.totalPages,
    currentPage: req.currentPage,
    totalPages: Math.ceil(count/limit)
  })
})

app.get('/api/getsourcebyid', (req, res) => {
  let id = req.query.id

  Source.findById(id, (err, doc) => {
    if (err){
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.send(doc)
  })
})

app.get('/api/getsources', sourceQuery, (req, res) => {
  res.status(200).json({
    results: req.sources.length,
    sources: req.sources
  })
})

//POST routes
app.post('/api/login', (req, res) => {
  const {email, password} = req.body
  const options = {filter: `(&(mail=${email})(userPassword=${password}))`}

  //search for entry in ldap - if it exists, proceed with auth
  ldap.search('dc=test', options).then((result) => {
    //ldap confirms user email & password
    if (result.entries[0]) {
      //check if user email exists in User collection
      User.findOne({email}, (err, user) => {
        //if not, add them
        if(!user){
          let user = new User({email})
          user.generateToken((err, user) => {
            if(err) return res.status(400).send(err)
            //send user data as a response cookie
            res.cookie('auth', user.token).json({
              isAuth: true,
              id: user._id,
              email: user.email
            })
          })
        }
        else {
          //generate token for user
          user.generateToken((err, user) => {
            if(err) return res.status(400).send(err)
            //send user data as a response cookie
            res.cookie('auth', user.token).json({
              isAuth: true,
              id: user._id,
              email: user.email
            })
          })
        }
      })
    }
    else {
      res.status(401).json({error: 'User auth error'})
    }
  })
  .catch((err) => res.status(200).json({error: err}))
})

app.post('/api/addjob', (req,res) => {
  const job = new Job(req.body)

  job.save((err, doc) => {
    if (err){
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.status(200).json({
      post: true,
      jobId: doc._id
    })
  })
})

app.post('/api/addjobs', (req,res) => {
  const jobs       = req.body
  let savedCounter = 0

  jobs.forEach( job => {
    const newJob = new Job(job)
    newJob.save((err, doc) => {
      if (err){
        logger.warn(err)
      }
      //FIXME no increment, returns a false positive post: false response
      else {
        savedCounter++
      }
    })
  })

  if (savedCounter > 0) {
    res.status(200).json({total_ads: savedCounter, post: true})
  }
  else {
    res.status(200).json({total_ads: savedCounter, post: false})
  }
})

app.post('/api/addsource', (req,res) => {
  const source = new Source(req.body)

  source.save((err, doc) => {
    if (err){
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.status(200).json({
      post: true,
      sourceId: doc._id
    })
  })
})

app.post('/api/addsources', (req,res) => {
  const sources = req.body

  sources.forEach( source => {
    const newSource = new Source(source)
    newSource.save((err, doc) => {
      if (err){
        logger.warn(err)
        return res.status(400).send(err)
      }
    })
  })

  res.status(200).json({post: true})
})

//DELETE routes
app.delete('/api/deletejob', (req, res) => {
  let id = req.query.id

  Job.findByIdAndRemove(id, (err, doc) => {
    if(err) return res.status(400).send(err)
    res.json(true)
  })
})

app.delete('/api/deletesource', (req, res) => {
  let id = req.query.id

  Source.findByIdAndRemove(id, (err, doc) => {
    if (err){
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.json(true)
  })
})

//UPDATE routes
app.post('/api/updatejob', (req, res) => {
  Job.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, doc) => {
    if (err){
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.json({
      success: true,
      doc
    })
  })
})

app.post('/api/updatesource', (req, res) => {
  Source.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, doc) => {
    if (err){
      logger.warn(err)
      return res.status(400).send(err)
    }
    res.json({
      success: true,
      doc
    })
  })
})

app.listen(port, () => {
  console.log(`API is up in port ${port}, running in ${dbconf.MODE} mode`)
  logger.info(`API is up in port ${port}, running in ${dbconf.MODE} mode`)
})
