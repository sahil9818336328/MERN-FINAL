import { StatusCodes } from 'http-status-codes'
import User from '../models/userModal.js'
import Job from '../models/jobModels.js'
import cloudinary from 'cloudinary'
import { formatImage } from '../middleware/multerMiddleware.js'
import { promises as fs } from 'fs'

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId })
  const userWithoutPassword = user.toJSON()
  res.status(StatusCodes.OK).json({ user: userWithoutPassword })
}

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments()
  const jobs = await Job.countDocuments()
  res.status(StatusCodes.OK).json({ users, jobs })
}

export const updateUser = async (req, res) => {
  const newUser = { ...req.body }
  delete newUser.password

  if (req.file) {
    const file = formatImage(req.file)
    const response = await cloudinary.v2.uploader.upload(file)
    newUser.avatar = response.secure_url
    newUser.avatarPublicId = response.public_id
  }

  const oldUser = await User.findByIdAndUpdate(req.user.userId, newUser)

  if (req.file && oldUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(oldUser.avatarPublicId)
  }

  res.status(StatusCodes.OK).json({ msg: 'User updated successfully' })
}
