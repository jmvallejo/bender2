import { Router } from 'express'
import * as indexController from '../controllers/indexController'

// Create default router
const router = Router()

// Define routes
router.get('/', (req, res) => res.send('Hello Bender 2.0!'))
router.post('/signup', indexController.signup)

export default router
