import Job from '../models/jobModels.js'

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({})
  res.status(200).json({ jobs })
}

// CREATE JOB
export const createJob = async (req, res) => {
  const job = await Job.create(req.body)

  res.status(200).json({ job })
}

// GET SINGLE JOB
export const getJob = async (req, res) => {
  const { id } = req.params
  const job = await Job.findById(id)
  if (!job) {
    return res.status(404).json({ msg: `no job with id ${id}` })
  }
  res.status(200).json({ job })
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

  res.status(200).json({ msg: 'job modified', job: updatedJob })
}

// DELETE JOB
export const deleteJob = async (req, res) => {
  const { id } = req.params
  const removedJob = await Job.findByIdAndDelete(id)
  if (!removedJob) {
    return res.status(404).json({ msg: `no job with id ${id}` })
  }

  res.status(200).json({ msg: 'job deleted', job: removedJob })
}
