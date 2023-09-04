import express from 'express'
import 'express-async-errors'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import jobRouter from './routes/jobRouter.js'
import mongoose from 'mongoose'

dotenv.config()
const app = express()
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/', (req, res) => {
  res.json({ msg: 'data received', data: req.body })
})

app.use('/api/v1/jobs', jobRouter)

// FOR IN-COMING REQUESTS
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

// WITHIN EXISTING REQUEST
app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({ msg: 'something went wrong' })
})

const port = process.env.PORT || 5000

try {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}
