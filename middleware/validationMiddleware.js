import { body, validationResult, param } from 'express-validator'
import { BadRequestError, NotFoundError } from '../errors/customErrors.js'
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
  param('id').custom(async (value) => {
    const isValid = mongoose.Types.ObjectId.isValid(value)
    if (!isValid) throw new BadRequestError('Invalid mongoDB Id')
    const job = await Job.findById(value)
    if (!job) throw new NotFoundError(`no job with id : ${value}`)
    // IF EVERYTHING'S GOOD, PASS THE CONTROL TO THE RESPECTIVE CONTROLLER
  }),
])

// REGISTER VALIDATION
export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if (user) {
        throw new BadRequestError('email already exists')
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  body('location').notEmpty().withMessage('location is required'),
  body('lastName').notEmpty().withMessage('last name is required'),
])

//LOGIN VALIDATION
export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
])
