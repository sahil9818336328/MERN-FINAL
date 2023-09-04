import Job from '../models/jobModels.js'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError } from '../errors/customErrors.js'

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({})
  res.status(StatusCodes.OK).json({ jobs })
}

// CREATE JOB
export const createJob = async (req, res) => {
  const job = await Job.create(req.body)

  res.status(StatusCodes.CREATED).json({ job })
}

// GET SINGLE JOB
export const getJob = async (req, res) => {
  const { id } = req.params
  const job = await Job.findById(id)
  if (!job) throw new NotFoundError(`no job with id ${id}`)
  res.status(StatusCodes.OK).json({ job })
}

// UPDATE JOB
export const updateJob = async (req, res) => {
  const { id } = req.params
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
  })

  if (!updatedJob) {
    return res.status(404).json({ msg: `no job with id ${id}` })
  }

  res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob })
}

// DELETE JOB
export const deleteJob = async (req, res) => {
  const { id } = req.params
  const removedJob = await Job.findByIdAndDelete(id)
  if (!removedJob) {
    return res.status(404).json({ msg: `no job with id ${id}` })
  }

  res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob })
}
