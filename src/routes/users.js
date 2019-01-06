import { Router } from 'express'
import * as usersController from '../controllers/usersController'
import authenticate from './middleware/authenticate'

// Create router
const router = Router()

// Use authenticate
router.use(authenticate)

router.get('/', usersController.list)

export default router