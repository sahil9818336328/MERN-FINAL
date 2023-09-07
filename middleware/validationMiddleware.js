import { body, validationResult, param } from 'express-validator'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customErrors.js'
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js'
import mongoose from 'mongoose'
import Job from '../models/jobModels.js'
import User from '../models/userModal.js'

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    // IF VALIDATION FAILS THE FUNCTION WILL THROW AN ERROR PASSING IN THE APPROPRIATE MESSAGE
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg)
        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages)
        }

        if (errorMessages[0].startsWith('not authorized')) {
          throw new UnauthorizedError(
            'You are not authorized to access this route'
          )
        }

        throw new BadRequestError(errorMessages)
      }
      next()
    },
  ]
}

export const validateJobInput = withValidationErrors([
  // ALL THE VALUES THAT NEEDS TO BE VALIDATED
  body('company').notEmpty().withMessage('Company is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('jobLocation').notEmpty().withMessage('Job location is required'),
  body('jobStatus')
    .isIn(Object.values(JOB_STATUS))
    .withMessage('Invalid status value'),
  body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('Invalid job type'),
])

export const validateIdParam = withValidationErrors([
  // VALUE = ID VALUE
  param('id').custom(async (value, { req }) => {
    const isValid = mongoose.Types.ObjectId.isValid(value)
    if (!isValid) throw new BadRequestError('Invalid mongoDB Id')
    const job = await Job.findById(value)
    if (!job) throw new NotFoundError(`No job with id : ${value}`)
    const isAdmin = req.user.role === 'admin'
    const isOwner = req.user.userId === job.createdBy.toString()
    if (!isAdmin && !isOwner)
      throw UnauthorizedError('You are not authorized to access this route')
    // IF EVERYTHING'S GOOD, PASS THE CONTROL TO THE RESPECTIVE CONTROLLER
  }),
])

// REGISTER VALIDATION
export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if (user) {
        throw new BadRequestError('Email already exists')
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('location').notEmpty().withMessage('Location is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
])

//LOGIN VALIDATION
export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
])

// UPDATE USER
export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email })
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error('Email already exists')
      }
    }),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('location').notEmpty().withMessage('Location is required'),
])

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('You are not authorized to access this route')
    }
    next()
  }
}
