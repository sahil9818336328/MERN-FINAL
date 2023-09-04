import { UnauthenticatedError } from '../errors/customErrors.js'
import { verifyJWT } from '../utils/tokenUtils.js'

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies
  if (!token) throw new UnauthenticatedError('Authentication invalid')

  try {
    const { userId, role } = verifyJWT(token)
    req.user = { userId, role }
    next()
  } catch (error) {
    if (!token) throw new UnauthenticatedError('Authentication invalid')
  }
}
