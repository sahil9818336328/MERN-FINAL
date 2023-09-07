import {
  BadRequestError,
  UnauthenticatedError,
} from '../errors/customErrors.js'
import { verifyJWT } from '../utils/tokenUtils.js'

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies
  if (!token) throw new UnauthenticatedError('Authentication invalid')

  try {
    const { userId, role } = verifyJWT(token)
    const testUser = userId === '64f98cd0769b610d522b8229'
    req.user = { userId, role, testUser }
    next()
  } catch (error) {
    if (!token) throw new UnauthenticatedError('Authentication invalid')
  }
}

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Demo User. Read Only!')
  }
  next()
}
