import express from 'express'
import 'express-async-errors'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import jobRouter from './routes/jobRouter.js'
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import mongoose from 'mongoose'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import { authenticateUser } from './middleware/authMiddleware.js'
import cookieParser from 'cookie-parser'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'
import cloudinary from 'cloudinary'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const __dirname = dirname(fileURLToPath(import.meta.url))

// TO HAVE ACCESS TO REQ.BODY
const app = express()
app.use(express.json())
app.use(cookieParser())

// ONLY RUN LOGS IN DEVELOPMENT
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// FOR FILE UPLOAD
app.use(express.static(path.resolve(__dirname, './client/dist')))

// ROUTERS
app.use('/api/v1/jobs', authenticateUser, jobRouter)
app.use('/api/v1/users', authenticateUser, userRouter)
app.use('/api/v1/auth', authRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'))
})

// FOR IN-COMING REQUESTS
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

// WITHIN EXISTING REQUEST
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

// CONNECT DB AND START SERVER
try {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}
