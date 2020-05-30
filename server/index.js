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

mongoose.Promise = global.Promise
mongoose.connect(dbconf.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const port = process.env.PORT || 3001
const app  = express()
const ldap = new ldapClient({url: dbconf.LDAP})

app.use(bodyParser.json())
app.use(cookieParser())


//GET routes
/*TODO:
- userisauth route, with auth middleware. Will be required for restricted routes in client
- logout route, with auth middleware
- auth middleware. Will be used to find user by token, in User collection
*/

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

app.get('/api/getjobs', jobQuery, (req, res) => {
  res.status(200).json({
    results: req.jobs.length,
    jobs: req.jobs
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

//TODO Add here user GET routers - isauth route, logout route

//POST routes
app.post('/api/login', (req, res) => {
  const {email, password} = req.body
  const options = {filter: `(&(mail=${email})(userPassword=${password}))`}

  //search for entry in ldap - if it exists, proceed with auth
  ldap.search('dc=test', options).then((result) => {
    if (result.entries[0]) {
      /*TODO:
      1) Check if user exists in User collection. If not, add him/her
      2) generate session token for user
      3) send user data as a response cookie
      */
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
  const jobs = req.body

  jobs.forEach( job => {
    const newJob = new Job(job)
    newJob.save((err, doc) => {
      if (err){
        logger.warn(err)
        return res.status(400).send(err)
      }
    })
  })

  res.status(200).json({post: true})
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
