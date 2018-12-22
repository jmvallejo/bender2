import { Router } from 'express'

// Create default router
const router = Router()

// Define routes
router.get('/', (req, res) => res.send('Hello Bender 2.0!'))

export default router
