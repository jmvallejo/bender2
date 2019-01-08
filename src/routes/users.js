import { Router } from 'express'
import * as usersController from '../controllers/usersController'
import authenticate from './middleware/authenticate'

// Create router
const router = Router()

// Use authenticate
router.use(authenticate)

router.get('/', usersController.list)
router.get('/:userId', usersController.view)
router.put('/:userId', usersController.update)
router.delete('/:userId', usersController.archive)

export default router