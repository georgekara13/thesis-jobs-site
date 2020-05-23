const express      = require('express')
const mongoose     = require('mongoose')
const dbconf       = require('./configuration/dbconf').dbconf()
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
const {logger}     = require('./configuration/logger')

//models
const { User }   = require('./model/user')
const { Job }    = require('./model/job')
const { Source } = require('./model/source')

//middleware
const { jobQuery } = require('./middleware/constructquery')

mongoose.Promise = global.Promise
mongoose.connect(dbconf.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })

const port = process.env.PORT || 3001
const app  = express()

app.use(bodyParser.json())
app.use(cookieParser())


//GET routes
app.get('/api/getjobbyid', (req, res) => {
  let id = req.query.id

  Job.findById(id, (err, doc) => {
    if (err) return res.status(400).send(err)
    res.send(doc)
  })
})

app.get('/api/getjobs', jobQuery, (req, res) => {
  res.json({
    jobs: req.jobs
  })
})

app.get('/api/getsourcebyid', (req, res) => {
  let id = req.query.id

  Source.findById(id, (err, doc) => {
    if (err) return res.status(400).send(err)
    res.send(doc)
  })
})

app.get('/api/getsources', (req, res) => {
  //TODO add pagination param
  let {
        name,
        browserName,
        browserMode,
        confModule,
        confUrl,
        confTotalAds,
        confscrapeFrequency
      } = req.query

  Source.find({
    name,
    browser:{
      name: browserName,
      mode: browserMode
    },
    conf: {
      module: confModule,
      url: confUrl,
      totalAds: confTotalAds,
      scrapeFrequency: confscrapeFrequency
    }
  }).exec((err, doc) => {
    if (err) return res.status(400).send(err)
    res.send(doc)
  })
})

//TODO Add here user GET routers - isauth route, logout route

//POST routes
app.post('/api/addjob', (req,res) => {
  const job = new Job(req.body)

  job.save((err, doc) => {
    if(err) return res.status(400).send(err)
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
      if(err) return res.status(400).send(err)
    })
  })

  res.status(200).json({post: true})
})

app.post('/api/addsource', (req,res) => {
  const source = new Source(req.body)

  source.save((err, doc) => {
    if(err) return res.status(400).send(err)
    res.status(200).json({
      post: true,
      sourceId: doc._id
    })
  })
})

app.post('/api/addsources', (req,res) => {
  const sources = req.body

  sources.foreach( source => {
    const newSource = new Source(source)
    newSource.save((err, doc) => {
      if(err) return res.status(400).send(err)
    })
  })

  res.status(200).json({post: true})
})

//DELETE routes

//UPDATE routes

app.listen(port, () => {
  console.log(`API is up in port ${port}, running in ${dbconf.MODE} mode`)
})
